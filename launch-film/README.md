# DeepKids Gurukul launch film

Source code for the launch film, drawn entirely in code with the anidoodle plugin, in its Mid-century gouache style. No video files are kept here.

- `gurukul.ts`: the film. 9:16, 45.5 s, 30 fps. The running order, the round match cuts between scenes, the zoom out to the stars.
- `nap.ts`: Amma asleep at the table, and waking up after her nap.
- `dream.ts`: the dream scenes: the Velcro burr, kingfisher to bullet train, the floating-needle compass, seed to banyan, two mirrors, the zoom out to IAm.
- `cast.ts`: Amma and Kavya, one drawing used in every scene.
- `app.ts`: the phone with the app's feature list and the Log in button.
- `gouache.ts`: the shared brush kit, with the dream mode where the ink line drifts.
- `gurukulScore.ts`: the score (Carnatic flute and drone, misra chapu rhythm, ragas Kharaharapriya, Kalyani and Shankarabharanam).
- `burr.ts`: an early test in a custom style. Superseded.

To rebuild: scaffold an anidoodle project (`scaffold.mjs <dir> --film gurukul --format 9x16`), copy these files into `src/canvas-core/`, add a `src/hosts/page-gurukul.ts` that mounts `gurukul`, install the harp and timpani recordings (`soundfetch.mjs get harp timpani rooms`), then run `node tools/render.mjs gurukul --poster-frame 1330`. The same code gives the same frames and sound every time.
