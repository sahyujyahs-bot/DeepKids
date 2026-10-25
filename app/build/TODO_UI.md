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
