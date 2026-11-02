# Handover for a fresh session (read this first, then CLAUDE.md)

The founder is not a programmer. Short, plain replies. She pays for every token (see "Spending" in CLAUDE.md): ask her which model before every helper job, helpers never on Opus, run big jobs in batches of about 10 units, one combined preview instead of many screenshot rounds.

## Standing rules (also in CLAUDE.md)
- Branch `claude/homeschooling-app-india-83y794`; a push deploys app.deepkids.in in about 15 minutes. No pull requests. The stop hook needs a clean tree: `find app/content/media -name "*.dl" -delete`, then commit and push, often.
- End commits with the Co-Authored-By and Claude-Session lines for the model in use.
- Never commit live user data, keys or phone numbers. Images: public domain, CC0 or CC BY with credit, or the founder's own drawings, or Canva designs credited "Designed in Canva".
- Build chain: `python3 app/build/combined/build.py`, `python3 app/build/build_app.py`, `python3 web/build_web.py`, `git checkout web/public/config.js`. Checks: `cd app && npm run lint`, `node app/tests/matrix.js <url>` (15 family types), `clickall.js`, `unitflow.js`. A test server on a copy of `app/index.html` with `<meta charset="utf-8">` in front, with `media` and `units` linked beside it.
- Questions test ideas, never the book (WRITING.md). Without AI first.

## Where things stand (2 Nov 2026)
- Science units: Levels 1 to 3 all written, play-tested, live (42 + 64 + 147). Level 4 (160 planned) and Level 5 (248 planned) not written: Class 4 is next. One sample unit each exists.
- All 928 book-detail questions rewritten as concept questions. Done.
- Media still to do for Levels 1 and 2: set-up drawings (about 75 units, about 450 drawings left), many card pictures, videos missing on 25 units (35 videos; use a cheap Haiku helper with `app/build/find_videos.py --search`), songs not written for any unit (founder said later).
- Level 3: the covers, experiments and projects that were empty are now drawn. About 1,500 explanation and word cards have no picture and probably should stay that way.
- Welcome screen, Today pictures, Progress (constellation tiles), subject colours (navy maths, yellow English, coral Hindi, green science) are done and approved. The founder's drawings are in `app/content/drawings/` (README lists them).
- Waiting on the founder: the 77 Canva pictures (Excel list sent), a new picture for the "Know what your child has learned" welcome slide, a redraw of the rooftop picture if she wants one, whether the Meet IAm slide should say "Part of DeepKids Plus" (it does).
- Stale web tests: `web/tests/test_web.js`, `test_plus.js`, `test_edits.js`, `test_flash.js` still expect the old phone log-in.
- Not done yet: white text on the new yellow English colour may be hard to read in a few places (labels, finished-chapter dots).

## Running when the old chat ended
- Nothing. The Level 3 fill (covers, experiments, projects for 20 units) finished and was saved.

## How the drawing jobs work
- Style engine: an anidoodle project (flatKit.ts and moongFlat.ts are in `app/build/drawings/`). It lives only in a session scratchpad (`.../scratchpad/art`, with node_modules); in a new session, create one with `node <anidoodle skill>/engine/tools/scaffold.mjs` and copy those two files into `src/canvas-core/`.
- Job scripts: `app/build/workflows/lean-unit-media.js` (one Fable helper per unit: all missing set-up cards plus up to 10 card pictures) and `lean-fill-keys.js` (draws exactly the listed slots). Fable cost about 106,000 tokens per unit with the lean method. Both take `args` as a list of `{f: "<unit>.json", s: setup count}` or `{f, keys: [...]}`.
- Audit: `python3 app/build/audit_media.py -v` (run from the repo root) lists what each unit still lacks.
- Question rewrites: `app/build/apply_question_rewrites.py` applied the helper results while keeping each file's layout.

## Good habits learned
- The unit checker prints `<file>: OK (...)` on success; it does not start with OK.
- Never run `git stash` and `git stash pop` as a pair on a clean tree: pop applies an old stash. There is one old stash on purpose; leave it.
- Wikimedia Commons refuses requests most of the time; iNaturalist and NASA work.
