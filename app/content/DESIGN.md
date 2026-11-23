# DeepKids look: the notebook and the night sky

Made with Anthropic's frontend-design skill (github.com/anthropics/skills, `frontend-design`).

## Why the old look read as "every AI app"
Fredoka and Nunito (the default rounded "kids app" pair), a cream background, a candy pastel palette, every block in an identical rounded card with the same soft grey shadow, an ALL-CAPS tracked label above every heading, meta strings joined with middle dots, and an emoji on everything. None of it came from DeepKids.

## Where the new look comes from
- **The founder's SCI Cards:** night-indigo skies, a bold red frame, hand-drawn eyes, stars and spirals, the third eye. Deep, a little strange, unmistakably ours.
- **The Indian school notebook:** cool white paper, faint blue rule lines, the red margin line down the left, handwriting in the margins.
- **Indian type foundries:** typefaces made in India, which also set Hindi properly.

## The one design language
Every screen is the same family: calm paper, white cards, one red action. The rules below are the whole language. Each thing is defined once in `app/src/styles.css` (tokens in `:root`, components under "Shared components"); a screen never restyles them.

### Colour roles
| Role | Token | Hex | Use |
|---|---|---|---|
| Paper | `--bg` | #FCFCF8 | the page (cool white, not cream) |
| Card | `--surface` | #FFFFFF | cards, fields, chips |
| Track | `--track` | #EFECE2 | the soft bed under tabs and notes |
| Ink | `--ink` | #1F2440 | text, outlines, the chosen chip (indigo, never grey-black) |
| Muted | `--muted` | #646985 | second-line text and small labels |
| Rule | `--rule` | #DCE0EA | thin lines between rows, field and chip outlines |
| Margin red | `--margin` | #D7372B | the one main action on a screen, "now", today's ring |
| Turmeric | `--sun`, `--sunbg`, `--sunink` | #E8A317 | today, highlights, the big-ideas note |
| Peacock | `--aqua`, `--good` | #0F6E6B | links, done, progress |
| Night | `--night` | #1E1436 | the one dark band: the Today picture at night, the Games and Research headers |
| Wrong | `--bad` | #C2271D | errors and wrong answers only |

**Subject colours** (`subjClass(subject)` sets `--c`): Maths peacock, English #5B4BB7, Hindi margin red, Science #3C8A3F, DeepKids turmeric. A subject colour is used softly: a small icon square or number square (14% tint with the colour as text), a left line, a progress bar, the stars on a Progress card, the tint of the subject banner. Never white or dark text on a full block of subject colour.

**Status**: not started = grey pill, in progress = turmeric, done = peacock.

### Type
Rozha One (`--poster`) for page and unit titles only; Mukta (`--body`) for everything else. Sizes are the steps `--fs-1` to `--fs-8` only (`check_type_scale.py`).

| Role | Step | Notes |
|---|---|---|
| Page title (`.pagetop h1`, unit title) | `--fs-7` 28px | Rozha One |
| Section heading (`.sech h3`) | `--fs-5` 18px | Mukta 700 |
| Card title (`b`, `.h5`) | `--fs-5` 18px, `.h4` 16px in tight rows | Mukta 700 |
| Body | `--fs-5` 18px, `.sm` 14px for helper text | Mukta 400 |
| Small label (`.xs`) | `--fs-2` 12px | muted |
| Eyebrow (`.eyebrow`) | `--fs-3` 14px | Mukta 600, muted, sentence case |

### Space, corners, shadow
- Space: 4, 8, 12, 16, 20, 30. Inside a card 18; between cards 12; between sections 30 (`.sec`); page gutter 16.
- Corners: cards `--r-card` 20px; buttons and toasts `--r-btn` 14px; fields `--r` 8px; chips, pills and round buttons fully round.
- Shadow: one, `--shadow`, on cards only. No borders around cards, no hard offset shadows. A ring (2px, red or ink, outside the card) marks "today" or "chosen".
- Anything you tap is at least 44px tall on a phone (small buttons and chips 40px). The focus ring is turmeric, everywhere. Motion stops under `prefers-reduced-motion`.
- Pages, sheets and units end with 200px of room, so the last row clears the bottom bar and IAm's button.

### Components (one definition each)
| Component | Class | Look |
|---|---|---|
| Page header | `.sec.pagetop` (`pageHead()`) | Rozha title, then the page's tabs |
| Section heading | `.sech` with `h3` | heading left, a small count or link right |
| Card | `.card` (also `.menurow`, `.tile`, `.libcard`, `.pzcard`, `.wday`, `.skyt`) | white, 20px corners, the one shadow |
| List row | `.tcard` on Today, `.trow`/`.unit` for topics, `.fxpart` in a unit, `.res` inside a card | small tinted icon or number square, name, one muted line; dashed rule between rows inside one card |
| Chip | `.chip` | a round pill for one choice among several; chosen = ink |
| Pill | `.pill` | a status word, not tappable |
| Tabs (segmented switch) | `.seg` | soft track, chosen = white tab. A page's own tabs add `.segmain`: on a phone they stay on one line, scroll sideways and fade at the edges |
| Main button | `.btn` | filled margin red; one per screen or card |
| Second button | `.btn.line` (`.soft` is the same) | ink outline |
| Quiet button | `.link` | peacock underlined text |
| Done button | `.btn.green` | the one green |
| Button sizes | `.btn.sm` 44px, `.btn.xs` 40px | |
| Icon button | `.iconbtn` | 44px round, white |
| Tick | `.ck`, `.ckb` | round ring; peacock when done |
| Progress bar | `.bar` | soft track, fill in the subject colour |
| Note and empty state | `.note` | one quiet line on the track colour; an empty list says so in a note |
| Subject banner | `.chero` | soft tint of the subject colour, ink text, the subject's blob |
| Big-ideas note | `.oneness` | turmeric tint, ink text |
| Form field | `.inp`, `.field` | white, rule outline, 50px tall |
| Sheet | `dialog.sheet` with `.shead` | back arrow, title, read-aloud; cards on paper below |
| Toast | `.toast` | ink, 14px corners, above the bottom bar |

**Retired** (do not bring back): the purple page tabs and coloured chosen chips (`.libtabs`, `.trackseg`, `.pick.b/.s/.c`), full-colour and gradient cards (old `.chero`, `.oneness`, `.skyt`, `.libcard`, `.optcard` tints), hard offset shadows and ink outlines on cards and buttons (`.pzcard`, `.ages`, `.ck`), square icon buttons, the grey bold note.

### Shape in one line
White cards with round corners and one very soft shadow on paper; one red button; a second action is an ink outline; choices are round pills (chosen = ink); tabs are a soft track with a white tab. Pictures lead: Today opens on a time-of-day picture, a unit on its cover.

## Principles
1. **One bold thing per screen.** On Today it is the picture with the greeting, then one Next card with one big button. Everything else is quiet paper.
2. **Lists are calm rows, not card stacks.** Time, a small rounded colour icon, the name, a short line, a round tick; white space between, no lines.
3. **Labels in sentence case.** The one exception is the short red label above the thing to do next ("Next · 4:30 pm") and a unit's topic.
4. **Left aligned, generous line height**, lines under 70 characters.
5. **Colour means something:** red is "do this now", turmeric is "today", peacock is "done and growing".

## Inside a unit: the same calm page
A unit looks like the rest of the app, not like another product (made November 2026, after the first "workbook" look felt like a different site; the founder chose to tone the units down to match the app). It uses the shared look above: the same tokens (`--r-card`, `--r-btn`, `--shadow`, `--track`), the same buttons, pills and type. Its rules sit under "Inside a unit" in `styles.css` and only add what is special to a unit.

**The look**
- **Calm paper.** The page is plain Paper; no grid lines.
- **White cards, one soft shadow.** Parts, cards, the "What you will learn" card, the count tiles, the lesson-plan panel and the close button are white with round corners (`--r-card`) and `--shadow`. No ink outlines, no hard offset shadows, no borders.
- **The shared buttons.** One red button (Start or Continue); the second action is an ink outline; the green "Done" tick and "Next" are the one green used for "done and growing". The kinds of part are round pills (like the Library filters).
- **Colour per kind of part, used softly.** Every kind keeps its one colour (`FXKC` in `11-units.js`) on its pill icon, the small rounded icon square of its row, its step number and its progress bar, the way the app uses subject colours. Done is a green tick square.
- **Normal labels.** Small labels and counts are in Mukta, sentence case ("Step 2 of 4 · 11 min", "About this unit"). No monospace, no all-caps. Titles stay Rozha One, reading text Mukta.
- **A little character stays.** The cover picture opens the unit as a rounded card, and Tara, the notebook star with a third eye (`fxStar()`), sits beside the counting tiles and cheers on the "Done" card. She is the only mascot inside a unit; IAm stays the guide you ask.

**How it is laid out**
- **One page for the whole unit.** Cover picture and title, one red button (Start or Continue), a row of round pills (one for each kind of part), then every part as a row, grouped by kind.
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
