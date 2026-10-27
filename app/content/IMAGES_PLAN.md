# Pictures plan

The 61 science units describe about 6,000 pictures (`art` fields); about 160 exist. AI generation cannot pay for all of them, so each picture comes from the cheapest source that does the job well.

## Sources, in order of preference
1. **Drawn by the app in code** (free, exact, unlimited). Experiment step pictures, simple science diagrams (magnet and field lines, the Earth turning in sunlight, the water cycle, a lever), charts. The app already draws the "ramp" and "pull" scenes this way (`fxScene`). Use this wherever a clean diagram teaches better than a painting.
2. **Real free photos** with credit, for real things: animals, plants, rocks and minerals, places, the sky, historical drawings and instruments. Only public domain, CC0 or CC BY. Sources: Wikimedia Commons, Openverse, Flickr Commons, NASA, and free-licence textbooks (OpenStax, already used through `app/build/book_images.py`). They go in the unit's "Real pictures" card (`<unit>.photos.json`, with `credit`), or in a card's picture slot when the photo shows exactly what the `art` describes.
3. **Canva AI** (the founder's monthly allowance): illustrations that need a made-up scene.
4. **OpenArt credits** (about 4,000 a month; 10 credits a picture with Kling 3 Omni, 40 with Nano Banana Pro): only the pictures that matter most and that nothing else can give.

## Which pictures each unit gets first
1. The unit cover (`summary.art`) and the opening question (`intro.art`).
2. The step pictures of the core-path investigation (`plan.spine`).
3. The story's pictures (5).
4. The flashcards (`terms`) and explanation cards, mostly from code diagrams and real photos.
5. Everything else later, or never: a card without a picture keeps its placeholder.

## Rules for every generated picture
- Write the prompt once, carefully, from the `art` brief and `DESIGN.md` ("Pictures tell the idea", "What makes a picture look made by a machine"). No test runs, no "try a few".
- One picture per brief. Regenerate only if it is wrong (wrong number of fingers, wrong animal, text in the picture), not for taste.
- Same style line in every prompt, so a unit looks like one book.
- Keep a log of what was generated, with the prompt and the cost.
