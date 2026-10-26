# DeepKids

A homeschool app for Indian families with children aged 6 to 10 (app.deepkids.in). This repository also holds the shop website files at the root (www.deepkids.in); the app lives in `app/` and its website build in `web/`.

## Where things are
- `app/src/`: the app's source. `index.html` is the page shell, `styles.css` is the one stylesheet, and `js/*.js` is the code, one file per feature (`07-day-plan.js`, `13-today.js`, `11-units.js`…), joined in file-name order into one script that shares one global scope.
  - Put a function in its feature's file. Functions can go anywhere; a `const` that is computed while the page loads must come after what it reads (the build order is the file order).
  - `22-startup.js` holds everything that runs at load (event listeners, timers, `boot()`), in the order it must run. Add new wiring there, with the handler written as a named function in its feature file.
- `app/content/`: lessons and units (JSON), plus the rules for writing them (`PHILOSOPHY.md`, `TRACKS.md`, `WRITING.md`, `DESIGN.md`, `units/SPEC_UNIT.md`).
- `app/build/`: Python scripts that turn content into `data.json`, and `build_app.py`, which builds the app.
- `app/tests/`: browser checks (Playwright).
- `web/`: the website build (`build_web.py`) and its platform layer (`web/src`).

## Build, check, ship
```
python3 app/build/combined/build.py   # content -> data.json (after changing units)
python3 app/build/build_app.py        # app/src -> app/index.html + app/build/template.html
python3 web/build_web.py              # -> web/public (deployed to app.deepkids.in on push)
cd app && npm run lint                # ESLint (0 problems) + Prettier check
sh app/tests/run.sh                   # every family type, every button, and a unit worked through, in a real browser
```
- A change to how anything looks or behaves: run `sh app/tests/run.sh snapshot /tmp/before` before the change and the same with `/tmp/after` afterwards, then compare the folders. Screens are reproducible to the pixel, so any difference is real.
- Never commit live user data, keys or phone numbers.

## How to write the code
- **One source.** Change `app/src`, never the built files (`app/index.html`, `app/build/template.html`, `web/public`). Don't patch code by string replacement in a build script, and don't wrap or reassign a function to change it: edit the function itself.
- **CSS in one place.** All styles go in `app/src/styles.css`, using the tokens in `:root`. Don't add `<style>` blocks or CSS strings in JS (printable documents that open in their own window are the one exception). Prefer a class over a long inline `style=""`.
- **Say it once.** Before writing a helper, search for one that exists (`esc`, `icon`, `blob`, `toast`, `sfx`, `unitBy`, `fxSt`, `dayPlan`…). If the same logic appears twice, make it one function and call it from both places.
- **Simple and surgical.** Change only what the task needs. No speculative options or abstractions. Remove anything your change leaves unused: functions, variables, CSS rules.
- **Tests first for behaviour.** When fixing a bug, reproduce it in the browser first (a short Playwright script), then fix it, then show the check passing.
- **Every button does what it says.** After UI changes, `clickall.js` must report nothing new.
- **Names:** say what a thing is or does (`lessonsGoing`, `fxWeekList`). The `fx` prefix marks the newer DeepKids-track layer.
- Match the surrounding style. Prettier formats everything (`npm run format`, 120 columns).

## Content and product rules
- Two tracks: the DeepKids track (topic-led) and the board track (chapter-led, with the DeepKids layer). Waldorf is a teaching style, not a board. See `app/content/TRACKS.md`.
- Units are full depth: roots with a `deep_truth`, and a 2-session spine (`app/build/validate_unit.py` must pass).
- Plain writing that a parent and child understand; no poetry where understanding is needed (`app/content/WRITING.md`).
- Images must be public domain, CC0 or CC BY, with credit. Non-commercial or share-alike books are reference only: never copy their text. Copyrighted books go in the private books repository. Personal essays are not published.
- Design: the notebook and night sky look in `app/content/DESIGN.md`. Universal and vibrant first, Indian touches only where they come naturally. It must not look like a generic AI app.
- The founder is not a programmer: keep replies short and plain.
