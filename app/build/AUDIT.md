# DeepKids app audit against FLOW_SPEC.md (2026-10-25)

Tested in Chromium (Playwright) against `app_prev.html` (= `app/index.html`), plus a read of `build/template.html` and `build/ui/patch_v73.js`. Test scripts: `/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/audit/t1.js` to `t7.js`. No page errors in any run. No code was changed.

## Biggest problems first

1. **Broken build: one line of `dayPlan` is copied 88 times** (template.html ~1755-1930: the `dkt` and no-lesson `refresh` lines). On any day with no lessons (weekends, skipped days) the Today screen shows **88 "Refresher" rows** (seen on screen, t7). The `dkt` copies do nothing only because `dkMinsOf=()=>0`. Whatever generated this (a patch script run in a loop) needs finding.
2. **Unit "completed" ignores its parts.** `logSession` marks a unit or chapter Completed once its session count is reached. A unit with 0 of 38 parts done went to History as completed (t3). The last session's open steps are dropped, not carried. Spec section 6 is not met for units.
3. **The DeepKids track is not built.** "DeepKids Plus first" mode = board chapters plus DK topic overviews. The 19 subtopic units never enter the plan unless a parent taps "Do next" or "Add to queue". Maths, English and Hindi have no DK content. "Only DeepKids Plus" gives an empty plan for every subject except DeepKids Science. There is no year-end board-coverage check in the scheduler, and no quarterly sprint.
4. **No end of day or sleep in the planner.** With a class from 9:00 to 12:30 and an outing from 14:00 to 21:30, the lessons were placed from 9:30 pm to 1:15 am (t4).
5. **Unit spine, linked-unit insertion and the buy list are missing.** `plan.spine` is never read: a unit is all 38 parts over 17 sessions. Units have no "linked unit" field. `buy[]` and `buy[].plan` only show as text inside the feed.
6. **Sign-up is a testing stub.** There is no Google login and no OTP. "0000000000" and "1234567890" are accepted. "+91 98765 43210" is rejected because the input has `maxlength=11`. The parent can pick only one board.

## Item by item

| Spec item | Status | Evidence | Gap |
|---|---|---|---|
| Google login | missing | `loginView`: phone + name only, "Testing mode, so no OTP yet" | No Google sign-in at all |
| Parent name + phone check | partly | `case "login"`: strips non-digits, needs 10 digits; t1: `12345`/`abcdefghij` rejected | Accepts 0000000000 and 1234567890 (no check that it starts with 6 to 9). `maxlength=11` rejects "+91 98765 43210" typed in full. Parent name is optional. No OTP. |
| Child name and age | works | onboarding step 0 (`obName`, age 6 to 10, class 1 to 5) | Name not required. Multiple children: not started (later, as planned) |
| Shop site verifies phones? | n/a | `/home/user/escapegravityv1` is one file, `escapegravity_final-18.html`: the "EscapeGravity – Pre-Order" board-game landing page | Not the DeepKids shop. No forms, no phone fields, no backend. `doPreOrder()` only shows `alert("Opening soon!")`. It verifies nothing. |
| Track choice and its explanation | partly | `MODES`: "Syllabus books" / "Books + DeepKids Plus" / "DeepKids Plus first", each with one line | Not named Board track / DeepKids track as in TRACKS.md. Free vs paid is not shown. The difference is one sentence each, not an explanation. |
| Waldorf | partly | offered as a board (`data-b="waldorf"`) with its own subjects (wml, wart) | The board-or-separate-approach decision is still open |
| Multi-board choice | missing | step 1 is single choice. "Combined" = all boards merged (`boardsOn`) | Cannot pick, for example, NCERT + Cambridge only |
| Subjects | works | step 2 `visSubj(board)`, needs at least 1 | – |
| Level per subject | works | step 3 `obl-<subj>` select, Level 1 to 5 | – |
| Placement quiz | missing | no code (grep placement, level test: none) | – |
| No level locked | works | Library browses any level. `plannedUnits` runs from the chosen level up to 5 | – |
| Pace per subject | partly | `hpd` hours a day per subject (onboarding), `S.days` weekdays per subject, `paceFactor` learns from timings | Changeable later in settings. OK. |
| Day types full/half/free | partly | `dayTypeOf`: only "full" or "busy" (30 min cap) per date. Free = skip | No weekly pattern of full, half or free days |
| Plan generation, Board track | works | `schedule`/`plannedAt`: NCERT L3 maths 14 chapters, done by 2027-03-31 (t2) | Chapters then roll straight into L4 and L5 |
| Plan generation, DeepKids track | partly (makeshift) | mode `plus`: same NCERT chapters for maths, English, Hindi; sci interleaves DK topics. `board=none`: maths, English, Hindi, sci plans are empty (t2). Units in schedule: 0 | The subtopic units are not queued automatically. No topic ladder for maths, English or Hindi. |
| Year-end board coverage | partly | `boardRows` shows "N behind" against the April-to-March year | The scheduler ignores it. NCERT sci L3 ends 2027-06-28, after year end (t2) |
| Quarterly sprint week | missing | no code | – |
| Insertion of linked units | missing | unit JSON has no linked-unit field (`links` are external URLs) | Nothing adds a unit when a project or problem is done |
| Manual queue changes | partly | `qnext`, `qlater`, `qrem`, `qadd`, `setOrder` (t4: reorder works), unit "Do next" / "Add to queue" | Board chapters can only be pushed later, not removed. `qrem` removes only added extras. |
| Unit spine (2 sessions) + Go deeper | missing | `plan.spine` never read. `fxDayPlan` packs all 38 parts into 17 sessions (t3) | "Go deeper" exists only as related-topic chips and the "Go deeper: subtopic feeds" card on 9 linked chapters |
| Daily plan from part minutes | partly | `fxDayPlan` packs parts by subject minutes (sessions of 25 to 60 min) | Lesson slot is always `hpd*60` (45 min), even when a session is 60 min |
| Multi-day experiments and projects | partly | `S.exps` + "Daily check-ins" 5 min item. `PRESET_EXP` for DK topics. Manual `startexp` | Unit `experiments/projects[].schedule` ("Day 3: ...") is display-only. Not scheduled or tracked. |
| Clashes with family plans | partly | `dayPlan.place()` avoids timed events and lunch (t4) | No sleep or day-end limit. Lessons spill past midnight (t4). All-day or untimed events are not avoided. |
| Prep morning or night before + reminders | partly | `prepBlock(am/pm)` by each item's `lead` day. Times in `prepAt`/`eveAt`. `remLinks` makes a Google Calendar reminder. In-app Notification | The parent cannot choose morning or night. Unit prep falls back to generic text ("Read the chapter yourself...") (t6) |
| Warm-up jokes + song | partly | warm item uses `dailyUnit()` = a sci chapter with `c.x` jokes ("Family and Friends" while the unit Magnetic materials was next, t5) | No song in the warm-up. The unit's own jokes and linked-unit songs are not used. |
| Daily game series | partly | `gamesView`: Word of the Day, True or False, Odd One Out from that sci chapter | Not built from the refresher list or the child's learned items. Needs Science chosen. |
| Refresher list from wrong answers app-wide | partly | units: `fxMark` → `F.ref`, shown in Plan → Refresher (t3: 1 entry). Chapters: `S.quiz` → `lastAnswers`/mastery | Two separate systems. Unit misses never reach the daily refresher (`rfPlan` stayed null, t3) |
| Spaced review of completed units | works (chapters) | `rfPlan` with `RFDEF` every 1, 3 or 10 days by mastery. t6: "Refresher: Family and Friends 15" | Units: only through session logs, and their quiz mastery is not used |
| Refresher time in daily plan | partly | 15 min "refresh" slot (`rfPlan`) | 88-copy bug on no-lesson days (problem 1) |
| Ongoing vs Pending vs Completed | partly | `itemState`/`stateCtl`/`stPills`: Ongoing, Pending (reached but not done), Queued, for chapter worksheets, quizzes, projects | Lesson and unit completion ignore open items (problem 2) |
| History and progress per part | partly | Unit card shows "Done n of P parts". `doneHistory` lists lessons and items | History takes units as completed by session count. No per-part history. |
| Buy and gather list + reminders | partly / missing | "To do" tab shows the gather prep for chapters (`prepAhead`) | No weekly buy list. Unit `materials`/`buy[]` are not collated. No buy reminders. |
| Worksheet evaluation in the app | partly | Unit worksheets and quiz are answered in the feed (`fxCarousel`/`fxMark`). Pack worksheets have answer pads | Board-chapter (`c.x`) worksheets are print-only |
| Worksheet photo AI check | partly | `aiCheckPhoto`/`aiCheckDraw` for pack worksheets only, needs `SAMPLE` (claude.ai). Unit worksheets: photo through the chat | Hidden when AI is off, not shown locked |
| AI locked until top-up | partly | `plusView` "Upgrade to Plus" → waitlist (`plusWait`). `DK_PLATFORM.upgrade` hook | The chat button "💬 Ask" is open to everyone and fails with a message. No top-up or credits concept. No payment. |
| Bought books/games enter the plan | missing | `S.inv` items show as chapter resources (template.html line 3285) | `buy[].plan` is never read. Nothing changes the daily plan. |
