# Launch film: test shots

Source code for the DeepKids Gurukul launch film, drawn entirely in code with the anidoodle plugin. No video files are kept here.

- `burr.ts`: shot 1, the Velcro burr dream, in the Dream glaze style. 9:16, 8 seconds, 30 fps, silent.

To rebuild: scaffold an anidoodle project (`scaffold.mjs <dir> --film burr --format 9x16 --duration 8`), copy `burr.ts` over `src/canvas-core/burr.ts`, then run `node tools/render.mjs burr --poster-frame 239`. The same code gives the same frames every time.
