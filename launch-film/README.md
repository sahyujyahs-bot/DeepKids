# DeepKids Gurukul launch film

Source code for the launch film, drawn entirely in code with the anidoodle plugin, in its Mid-century gouache style. No video files are kept here.

- `gurukul.ts`: the film. 9:16, 45.5 s, 30 fps. The running order, the round match cuts between scenes, the zoom out to the stars.
- `nap.ts`: Amma asleep at the table, and waking up after her nap.
- `scenes.ts`: the dream scenes, each a close shot of the activity with a caption: the Velcro burr, kingfisher to bullet train, the floating-needle compass, seed to banyan, two mirrors, my address in the universe (with IAm).
- `bust.ts`: Amma and Kavya in close shots, with reaching arms and hands.
- `dream.ts`: the first version of the dream scenes, now used only for the cosmos layers.
- `cast.ts`: Amma and Kavya, one drawing used in every scene.
- `app.ts`: the phone with the app's feature list and the Log in button.
- `gouache.ts`: the shared brush kit, with the dream mode where the ink line drifts.
- `gurukulScore.ts`: the music: the real world on Carnatic flute and drone (misra chapu, ragas Kharaharapriya and Shankarabharanam), the dream on its own cinematic piece (E lydian, celesta, harp, strings), joined with hard cuts.
- `burr.ts`: an early test in a custom style. Superseded.

To rebuild: scaffold an anidoodle project (`scaffold.mjs <dir> --film gurukul --format 9x16`), copy these files into `src/canvas-core/`, add a `src/hosts/page-gurukul.ts` that mounts `gurukul`, install the harp and timpani recordings (`soundfetch.mjs get harp timpani rooms`), then run `node tools/render.mjs gurukul --poster-frame 1330`. The same code gives the same frames and sound every time.
