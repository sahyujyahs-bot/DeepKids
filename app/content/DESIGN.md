# DeepKids look: the notebook and the night sky

Made with Anthropic's frontend-design skill (github.com/anthropics/skills, `frontend-design`).

## Why the old look read as "every AI app"
Fredoka and Nunito (the default rounded "kids app" pair), a cream background, a candy pastel palette, every block in an identical rounded card with the same soft grey shadow, an ALL-CAPS tracked label above every heading, meta strings joined with middle dots, and an emoji on everything. None of it came from DeepKids.

## Where the new look comes from
- **The founder's SCI Cards:** night-indigo skies, a bold red frame, hand-drawn eyes, stars and spirals, the third eye. Deep, a little strange, unmistakably ours.
- **The Indian school notebook:** cool white paper, faint blue rule lines, the red margin line down the left, handwriting in the margins.
- **Indian type foundries:** typefaces made in India, which also set Hindi properly.

## Tokens
| Name | Hex | Use |
|---|---|---|
| Ink | #1F2440 | text (an indigo ink, never grey-black) |
| Paper | #FCFCF8 | page (cool white, not cream) |
| Rule | #DCE0EA | lines between rows, like a copybook |
| Margin red | #D7372B | primary actions, the margin line, "now" |
| Turmeric | #E8A317 | highlights and today |
| Peacock | #0F6E6B | links, progress, science of growing things |
| Night | #1E1436 | the one dark band: the Today header (the violet night of www.deepkids.in) |
| Muted | #646985 | secondary text |

Subjects: Maths peacock, English #5B4BB7, Hindi margin red, Science #3C8A3F, DeepKids turmeric.

**Type**
- **Rozha One** (Indian Type Foundry): big headlines only. High-contrast poster letters, like old Indian print.
- **Mukta** (Ek Type): everything you read and tap. Clean, Latin and Devanagari.
- **Kalam** (Indian Type Foundry): handwriting for notes in the margin: labels, parent tips, deep truths.

**Shape** (the calm look the founder approved in November 2026, everywhere except inside a unit, see below; tokens `--r-card`, `--r-btn`, `--shadow`, `--track` in `:root`)
- White cards with round corners (20px) and one very soft shadow on the paper; no borders or grey lines around them.
- Buttons: the one main action is filled margin red; a second action is an ink outline; choices are round pills (chosen = ink).
- Two choices side by side are a segmented switch: a soft track with the chosen one as a white tab.
- Pictures lead: Today opens on a time-of-day picture with the greeting on it, a unit opens on its cover picture.

## Principles
1. **One bold thing per screen.** On Today it is the picture with the greeting, then one Next card with one big button. Everything else is quiet paper.
2. **Lists are calm rows, not card stacks.** Time, a small rounded colour icon, the name, a short line, a round tick; white space between, no lines.
3. **Labels in sentence case.** The one exception is the short red label above the thing to do next ("Next · 4:30 pm") and a unit's topic.
4. **Left aligned, generous line height**, lines under 70 characters.
5. **Colour means something:** red is "do this now", turmeric is "today", peacock is "done and growing".

## Inside a unit: the workbook page
The rest of the app is calm paper. A unit is where the work happens, so it looks like a child's workbook: bolder, with more colour, and made by hand (redesigned November 2026; tokens `--mono`, `--grid`, `--edge`, `--pop` in `:root`, rules under "Inside a unit" in `styles.css`).

**The look**
- **Grid paper.** The page is squared maths-copy paper (`--grid` lines on Paper), not plain white.
- **Ink outlines with a hard shadow.** Parts, cards, tiles and the close button have a 2px ink edge (`--edge`), small corners (10 to 14px) and a flat offset shadow with no blur (`--pop`, or the part's own colour). Like stickers and cut-out cards; never a soft grey shadow.
- **Flat colour blocks.** Three counting tiles under the title (sessions, parts, done) in turmeric, mint and leaf green. Every kind of part keeps its one colour (`FXKC` in `11-units.js`) on its tab, its icon square, its open heading and its card shadows.
- **Typewriter labels.** Small labels, times and counts are in the phone's own monospace (`--mono`): "FORCES · CLASS 3", "Step 2 of 4 · 11 min". Titles stay Rozha One, reading text stays Mukta.
- **Tara, the notebook star.** A small hand-drawn star with a third eye (`fxStar()`). She sits beside the counting tiles and cheers on the "Done" card. She is the only mascot inside a unit; IAm stays the guide you ask.

**How it is laid out**
- **One page for the whole unit.** Cover picture and title, one red button (Start or Continue), a row of divider tabs (one for each kind of part), then every part as a row, grouped by kind.
- **A part opens in place.** Tapping a row unfolds it on the same page: its heading stays at the top with a thin bar showing how far through it we are, and its cards sit under it in one column. Nothing moves to another screen. The arrow in the heading, the back gesture or Escape folds it away again. The last card says "Done", shows the next part and has one green button to go on.
- **Every card stands alone.** A slim strip on top holds its number and its own save (heart) and read-aloud buttons.
- **Activities, experiments, games, projects and challenges** open with one card that says plainly what we are doing and why, then the question, what you need, safety and the how-it's-done pictures, each said once. Then each step is one numbered card with only that step on it (its own picture where there is one, the instruction, a question, a Done tick). The last card asks what you found. The title is only in the part's heading.
- **Big screens (900px and up).** The unit sits in the page area: the side bar and the DeepKids logo stay in view and work. From 1200px a "Lesson plan" panel stays on the right with every part in teaching order, its minutes and a tick when done.
- **Phones.** The same page in one column, full screen; an open part runs edge to edge so the cards are as wide as the phone.
- A picture that is not drawn yet is a short band with the part's emoji, never an empty screen.
- Songs and refreshers use the same page: a slim bar with the name and a close button, then the cards in one column.

## Pictures tell the idea
Every unit cover and story picture is a full scene with a background, and it carries the unit's main idea from our point of view (`PHILOSOPHY.md`, "Our point of view"):
- **Tell the story.** Someone looking at the cover alone should guess the idea: for food, that a meal is made of sunlight, soil, rain, bees and people's work, not just "a plate of food".
- **Take the point of view.** Girls and women are often the ones doing the science. People share the scene with other living things as equals, not as the centre that everything serves.
- **Simple and hand-made.** Few elements, loose brush strokes and imperfect lines; nothing glossy or machine-perfect.

### What makes a picture look made by a machine, and what to do instead
Write these into every picture brief.
- **Every element earns its place.** Each thing in the picture either tells the story or quietly carries the idea underneath it. If it does neither, leave it out. Count the things: only as many as the story needs (two children, one lamp, one path; not a planet, a rainbow, a magnet and a tree all at once). Every element belongs to the scene, lit by the same light and sitting in the same space, so the picture looks whole.
- **One subject, then a quieter world.** The subject is sharp, detailed and strongest in contrast. The background is softer, less detailed and lower in contrast, as if slightly out of focus. Not everything at the same sharpness.
- **Different things, different textures.** Skin, cloth, fur, bark, water, stone and sky each look like themselves. Never one swirly or sparkly texture painted over everything.
- **No clichés of machine art:** no glitter or sparkle paths, no stars and swirls filling every gap, no glow on everything, no perfectly symmetric faces, no glossy plastic skin.
- **Light from one place.** One clear light source, with real shadows falling away from it.
- **Colour follows the moment.** Morning, noon, dusk and night each have their own colours. Not every picture at night; a set of pictures should vary through the day.

### People
- Real proportions for their age: a child of 8 is about six heads tall; adults are seven to eight heads tall. Never a huge head on a tiny body.
- Different faces: different noses, eyebrows, face shapes and skin tones from across India and the world. Not the same cute face copied.
- Eyes a natural size, not huge; expressions that fit what the person is doing (concentrating, wondering, laughing), not a fixed smile.
- Hands with the right number of fingers, doing something; feet on the ground.
- Real clothes with folds and wear, worn the way people wear them.

### Animals
- Drawn true to the real animal: the right body, legs, eyes and markings for the species (a koel is not a sparrow), unless the story says it is a character.
- Animal characters keep their animal body and behaviour; only the face is a little more expressive. No human smiles pasted on.
- Each animal does what it really does in the scene: a bee works a flower, a squirrel buries a seed.

### IAm, the Guru
- A lion-man, as old as the oldest lion-man carving (about 40,000 years): he belongs to everyone, not to one religion.
- Majestic and authoritative: tall, adult proportions, a long strong lion muzzle, heavy brow, calm steady eyes; never cute or childlike.
- A teacher, not a god: he sits normally on a stone step, reading a book held in a front hand on his lap, the other hands relaxed and clearly apart. When the family needs him he looks up from his book. No idol signs: no lotus throne, lamp, temple gold, hair knot, sacred thread or blessing pose.
- Four arms; a third eye; a bold black-ink lotus tattoo over his heart (Lakshmi in the heart).
- Cool, earthy colours: a tawny mane with dark tips, deep indigo trousers, a sage green sash. No red-gold glow.

## Inspiration: the founder's SCI cards
The SCI scientist trading cards show the look to borrow from (ideas only, not the cards themselves):
- **A frame of hand-drawn doodles:** eyes, spirals, lotuses and moons on a red border, plus symbols from the subject itself (H and He, Ra and Po, E=mc²).
- **Night-sky panels:** deep indigo and black behind the content, with stars and thin dashed lines joining people and ideas.
- **Glowing colour on dark:** figures painted in iridescent violet, magenta, teal and acid green, with loose brush strokes and ink outlines.
- **Symbols that mean something:** the third eye (seeing deeper), rarity halos (black hole, Sun, Saturn, Moon, asteroid), a deep violet mandala behind it all.
- **Every picture is a true moment** from the person's life, told from their side.

## Founder notes
- Don't make it all too Indian. Universal and vibrant first; Indian touches only where they come naturally (names, foods, places in content).
- Stunning, vibrant illustrations and a few well-placed animations make the biggest difference.
