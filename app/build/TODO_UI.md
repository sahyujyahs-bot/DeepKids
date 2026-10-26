# UI clean-up after the DeepKids track content is finished

- Library > Syllabus: one list per class, not two. Each topic shows its overview and its subtopic units under it
  (today the units sit in a separate "Subtopic units" card above the topic ladder).
- "Written in full" means two things today (topic overview vs subtopic units). Use one clear status per topic:
  "Units ready: 4 of 4", "Overview only", "Board chapters for now".
- Chip names: "DeepKids Combined" -> "DeepKids track"; explain or remove "DeepKids Plus".
- "Covers Cambridge Unit 3.1, Cambridge Unit 3.2…" list is noisy; show "Covers all boards" with a tap for details.

# App features after content (agreed with the founder)

1. **Outside classes in the plan** (~150–250k tokens): recurring classes (day, time, place, teacher, fee), planner keeps
   those slots free, Google Calendar sync, practice/attendance log with photo or voice, fee reminders, "what this class
   builds" on Progress, interest-based ideas from unit links. No college-race framing.
2. **Budget planning and tracking** (~100–150k, build with 1): monthly and per-child budget, categories (classes,
   books, tools, games, subscriptions, outings), recurring items and renewal alerts, "Add to budget" on every unit's buy
   list, receipt photo, spend vs budget chart.
3. **Family uploads become lessons** (~200–300k): parents upload books, notes, worksheets, photos (extends the existing
   quick upload + auto-tagging). We read them (text, or OCR for scans), tag to subtopic units, and use them in lessons,
   quizzes and the refresher list. Private to that family; never published or shared.
4. **Video link to lesson** (~100–150k, build with 3): parent pastes a YouTube or other video link. We get the
   transcript (YouTube captions first; speech-to-text for others), then make a summary, flashcards, quiz and refresher
   questions tagged to units. Look at the transcript skill the founder saw before building. Family's private use only.
5. **Sketchboard class** (~300–500k + ₹2–10 per session): Excalidraw (MIT) board, AI tutor talks and draws step by step
   from a unit, child draws answers and the AI reads them, browser voice first. Needs the API key on the server.
   Pilot on Friction. Live "verified teachers" later.
6. **Library clean-up** (see top of this file).

# When building maths units
- Answer checker: a small Python (SymPy) script that recomputes every maths answer in units and worksheets.
- Look at the "Math Practice Game" skill (gabrielmoreira/agent-skills-mirror) for game formats (a few hundred tokens).
- Later, for on-screen maths games: Awesome Gamedev Agent Skills (Phaser, PixiJS).

# UI references the founder liked (Dribbble, for direction only; never copy the art)
- GEL Guided E-learning (Martin Strba): week strip of days with dots, two small goal tiles at top ("Weekly goal 78/120 min", "Days until test"), a friendly mascot as study buddy, one big "Start now" button, simple 5-tab bar.
- Kites Design onboarding: bold one-colour screens (yellow, lilac, orange), playful line-art characters, big short headlines, one dark pill button at the bottom.
- Kids learning "Homework" board: subject filter chips, assignments as tilted paper cards with hand-drawn scribbles and arrows, a floating toolbar (colour, sticker, pen, add). Good for worksheets and the sketchboard later.
- Nixtio "My Learning Plan" (web): a path of lesson cards joined by a dotted line, status chips (Completed, Upcoming, Watching), counters (Total, Completed, Upcoming), events column on the right. Good for the plan and unit map.
- Camp app (Hi-fi design): warm illustrated scenes at the top of each screen, "Hello, <name>", search, round location chips, child registration with photo, chips for hobbies and allergies, one big green button. Good for onboarding and child profiles.
- Neobrutalism (NFT and Dino World sets): thick black outlines, flat lime/lilac fills, hand-drawn stars and squiggles, chunky buttons, quiz screens with big answer pills ("What type of dinosaur is this?"). Good for quizzes and games.
- Mobile store concept (Aleksey Kostiuk): bold single-colour backgrounds, character cards in a 2-column grid with filter chips. Good for the Library and the buy list.
- Kidory e-book app: illustrated book covers, author avatars, a story page with Audio/Text toggle and a reading panel (brightness, background colour, text size). Good for stories and read-aloud.
- Thinkeo (kids dashboard): "Hi, <child>", a week streak row with ticks, four big coloured subject tiles (Reading, Maths, Science, Creativity), "Continue learning" with a progress bar, badges row, 4-tab bar. Lesson screen: big illustration, a highlighted word, two big answer buttons, one Next button. **Closest to what DeepKids Today should feel like.**
- AI assistant + roadmap: a big voice button with camera and video, "prompts left" counter (fits the AI top-up lock), quick chips (Week summary, Create new plan), and a roadmap timeline by Day/Week/Month/Year with bars per course. Good for Plan.
- "Organize your day": calendar with a day strip and coloured task bars on a time line, "Today's tasks" and "Tomorrow tasks", a cute blob mascot. Good for the calendar.
- Learning progress set: big % progress with a line chart, Total/Completed/Upcoming counters, weekly bar chart of lessons and hours. Good for Progress.
- Illustrated calendar (Lotte Dirks style, for mood only): a soft painted landscape behind the month. Mood for the year plan.

# Skills seen (look at when building that part; nothing installed)
- dmccreary/ibook-skills: interactive textbooks, micro-simulations and quizzes. Look at for on-screen simulations in units.
- "teach" skill (Matt Pocock): keeps a learner's progress across sessions in notes.md. Compare with our refresher and progress design.
- "Anatomy": live behaviour models you can tweak on screen. Look at for physics simulations (forces, light).
- For the redesign: Anthropic's frontend design skill (avoids the generic AI look: purple gradients, cookie-cutter grids); TasteSkill and claude-code-ui-agents for layout rules.
- For on-screen games: PlayableIntelligence/game-creator (Phaser 2D), abagames/claude-one-button-game-creation (tiny speed drills: flashcards, fast maths), "Learning Game Designer" skill (points, badges, timed quizzes; check it fits DeepKids' no-race spirit).
- Testing: app/build/ui/matrix.js runs every board (DeepKids track, NCERT, Cambridge, NIOS, Waldorf) at ages 6, 8 and 10 and checks each main screen for errors. Run it after every app change.
