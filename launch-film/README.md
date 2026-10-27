# Launch film: test shots

Source code for the DeepKids Gurukul launch film, drawn entirely in code with the anidoodle plugin. No video files are kept here.

- `burr.ts`: first test, the Velcro burr dream, in a custom Dream glaze style. 9:16, 8 seconds, silent. Superseded.
- `nap.ts` + `gouache.ts`: the look test for the real film, Amma asleep at the table, in the built-in Mid-century gouache style. `gouache.ts` is the shared kit, with a dream mode where the ink line drifts.
- `gurukulScore.ts`: the 8-second music sample (Carnatic flute and drone, misra chapu rhythm, raga Kharaharapriya turning into Kalyani).

To rebuild: scaffold an anidoodle project (`scaffold.mjs <dir> --film burr --format 9x16 --duration 8`), copy `burr.ts` over `src/canvas-core/burr.ts`, then run `node tools/render.mjs burr --poster-frame 239`. The same code gives the same frames every time.
