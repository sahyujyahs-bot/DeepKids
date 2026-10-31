# Open items from the founder's chat (checked 27 Oct 2026)

Everything she asked for, 19–27 Oct, that is not done or only partly done. Ticked off here as it gets built.

## 📌 Pinned for the kids app (founder, 29 Oct)
- **Live AI canvas tutor (IAm on a whiteboard).** The child asks out loud, or snaps a worksheet. IAm talks and draws step by step on a shared board, using our unit's facts. The child draws back and IAm responds. "Save to Progress", with hard bits going to the refresher. Turn-based voice (the phone's own speech), Claude returns speech plus drawing steps, and the app animates them in the notebook style. Daily limit per family (Plus).
- **AI explainer video maker** (like ToMotion): a prompt or a unit card becomes a script, then code-drawn diagram scenes, voice and music, then an MP4. Same drawing engine as the live canvas. Also gives short explainers for units (helps the reading load).

## 📌 Pinned for the parents' app (founder, 30 Oct)
- **Sign-in screen story** (ideas 2 + 4, ~20 s, notebook turning into night sky, sign-in button always visible):
  1. The worry: the parent's pencil notebook at night, scribbles crossing out ("What do I teach tomorrow?", "Is she behind the NCERT syllabus?", "Plants? Again?", "Forgot the swimming fees…"). Words: "Every homeschooling parent knows this page."
  2. The turn: a small star lands; the mess sweeps away and a neat plan writes itself (9:30 Magnets: a test with steel bowls ✓ · 11:00 A story from Madurai · 4:00 Swimming). Words: "You teach. DeepKids Gurukul plans, tracks and remembers."
  3. The days add up: each ticked lesson floats up as a star; the page darkens to night. Words: "Every lesson your child really understands…"
  4. The payoff: stars join into topic constellations (Magnets, Plants, the Sky, Water) tagged NCERT ✓ / Cambridge ✓; the sky forms a child looking up. Words: "…becomes a sky of their own." Then "DeepKids Gurukul · THE homeschooling app".
  - Drawn in code (handwriting, paper, stars). A half-made notebook redesign is saved at scratchpad `signin-redesign.patch` (not live).
- **IAm: guide, don't tell** (hints and questions instead of answers) and **worksheet grading** from a photo, with weak spots going to the refresher.
- **Read-aloud practice** (like Google's Read Along): the child reads, the phone listens and marks hard words. For English and Hindi.
- **Feature Reels** (15 s each, problem → app fixes it → surprise), and a faceless Instagram plan. OpenArt test clip offered.

## Content
1. **Classes 1, 2, 4 and 5 science, and all maths.** Only Class 3 science is complete: 61 units and 30 class lessons. Class lessons written: Class 1 10/15, Class 2 11/18, Class 4 9/24, Class 5 12/31. No maths units exist. Make Classes 1–2 shorter.
2. ✅ **Done 27 Oct.** **The 16 older Class 3 lessons** were written before the new writing rules and need checking under them.
3. ✅ **Done 27 Oct.** **60% South Indian** (WRITING.md rule 11) was added after all units were written. They still lean North (roti 202, Mumbai 138, Delhi 108; idli 37, Chennai 30, Pongal 5) and need a pass.
4. **Songs:** one per topic. Only 3 are written (DeepKids, Friction, Gravity); about 20 are titles only.
5. **Videos:** 19 "find the video" entries left across 7 units.
6. **Scientists per unit**, mapped to her SCI cards. Not started.
7. **Level 1 topics from her three questions** (What is life / What is this world / Who am I) still without units:
   - how life began
   - Big Bang and galaxies
   - microbes
   - birds' eye view
   - weather and disasters
   - soil and rocks
   - electricity safety
   - genes and evolution
   - family history project
   - memory
   - food and energy
8. **Other subjects** (NCERT maths, English, Hindi; Cambridge maths and English) have chapter titles only: no day plans, worksheets or activities. NIOS has only EVS.
9. ✅ **Done 27 Oct.** **Missing books:** she offered to get the books we don't have. A list of missing books was never made.
10. **Curated resources:** "10 best worksheets per syllabus, per chapter" isn't done (there's one shared science pool).
11. **Buy links** all go to Amazon search pages. Home alternatives haven't been checked across units.
12. ✅ **Done 27 Oct.** **"How we see"** still has a "Looking feels like... reaching out" line. She should look at it.

## App features
13. **Projects section** (designed, not built):
    - swipe cards, a list, one active project at a time
    - filters
    - a 6-stage guided flow per project
    - new units each project needs
14. **Reading load** (proposed, not agreed):
    - short cards
    - read aloud by default in child mode
    - core path only
15. **Learner mode:** she has a plan and wants to build it in the coming weeks.
16. ✅ **Done 27 Oct.** **IAm called "Guru", not "teacher"**, in the app (17-ai.js, 17-iam.js, DESIGN.md).
17. **Daily game series** from everything learnt so far. Today it only uses the day's unit.
18. **Progress by topic:** wrong answers per topic and subtopic.
19. **Library by class** (now grouped by topic; matters once Class 4–5 units exist). Also the Library clean-up in TODO_UI.md.
20. **Waldorf as a weekly theme layer** on top of any track.
21. **Outside classes and tuitions:** recurring classes, fees, attendance, and what each class teaches, linked to progress (TODO_UI.md).
22. **Budget planning and tracking:** books, games, subscriptions.
23. **Video link to lesson:** a parent pastes a link and we make content and quizzes from it.
24. **Real phone notifications and reminders** that stay until done. Today they only work while the app is open.
25. **Apple Calendar live sync.** It's import only today; Google is live.
26. **Voice notes and WhatsApp-style dumping** into the planner (today: text, screenshots and the keyboard mic).
27. **Exam track:** NIOS and board registration dates, alerts, a registration guide and mock tests.
28. **Phone OTP verification.** It's still "testing mode".
29. **More than one child per parent.** She said "later".
30. **Payments:**
    - Razorpay keys, the webhook and the Plus function: needs a check that they're live
    - an AI top-up or token balance
    - whether the DeepKids track sits behind payment (currently open to all)
31. **Ready cart:** one tap to buy the week's items.
32. **Printable flashcards.** Only games and worksheets have Print.
33. **Debate research helper**, "talking points for both sides".
34. **Sketchboard class.** She said "later".

## Pictures, video, design
35. **Pictures in units:** about 160 of about 6,000 exist, 20 of 61 units have any, and free photos haven't been fetched across units. Keep the placeholders.
36. **Launch film** (in the separate chat): Dream glaze test. Her notes for it:
    - nap while working, waking after the nap
    - drooling, sprawled, the parent wowed too
    - a to-do list with ticks, then she taps Login
    - calm version first, then energetic; 30 s plus 15 s Reels
    - rich music
    - IAm as Guru
    - "THE homeschooling app"
37. **Animated stories** in units. Only the Friction explainer video exists.
38. **Hand-drawn look** for the remaining illustrations. A list of drawings she might do exists.
39. **"Looks like a Hindu religion app"**: no check of the overall look was done after the IAm changes.
40. **IAm's world:** little IAm, his family, turtle, eagle. She said "later".
41. **Welcome animation:** kids walking toward the light. Parked.
42. **Hugging Face token** for free AI video. Not added.

## Business and other
43. **Monthly cost per family** estimate: answered in chat only, not written down.
44. **Android and iPhone apps.** Only the installable website exists.
45. **City events** (treks, museums, parent meets). She said "later".
46. **Facts the writers flagged to spot-check:** no record that each was verified.
47. **Google Calendar on the website (pinned).** Two parts, neither started:
    - *Secret calendar link* (no approval needed): a parent pastes their calendar's secret iCal address once; a server function reads busy times for the day plan. Also works for Apple and Outlook calendars.
    - *One-tap "Connect Google Calendar"*: needs Google's verification of the calendar read scope: a privacy page that says what is read and kept, deepkids.in verified in Google Search Console, a short screen recording of the flow, a written reason. Review takes days to weeks; until then up to 100 test users, who see an "unverified app" warning. Calendar is a sensitive scope, not restricted: no paid security audit.
48. **Amazon cart (pinned):** exact Amazon products for each shopping item, and adding the whole list to an Amazon cart in one tap. Later.
49. **Pricing and money (pinned, come back later).** Idea on the table: 14-day free trial; DeepKids Plus about ₹499/month or ₹3,999/year with a monthly AI allowance (300 IAm questions, 30 photo checks); paid top-ups above cost; free planner after the trial. Recommended AI: Haiku for IAm chat, Sonnet for photo checks (≈ ₹50 per family at full use). Razorpay not connected yet. She felt the numbers were low; revisit with her target number and work backwards (families needed, yearly plans, family plan, paid packs).
50. **Projects section for all tracks (pinned).** Idea cards (origami, hardware, solarpunk and sustainable builds, stitching and mending, making clothes, art, comics, from her ideas bank). Simple projects: picture steps. Complex ones: Ask, Imagine, Plan, Build, Test, Improve, with decision points (2 or 3 choices and what each changes), fixes for common problems, and a photo project journal that goes on the transcript. IAm coaches (asks, doesn't tell) for Plus families; cards are written and checked, not made up by AI.
51. **Mapping activities, festivals and projects to units: after all units are done.** Festival calendar (all faiths, regions, nature and science days) with festival units planned 1 to 2 weeks before; re-link the activity library to the 82 new units and Maths/English/Hindi; add ~60 regional activities.
52. **All-India examples rule:** South, East, Northeast and West, not North by default (dosa and idli as well as roti). Add to WRITING.md and the checkers.
53. **Family's state from location:** guess from the server's view of the visit (city), confirm with one tap; add a line to the privacy page. No question in setup.
