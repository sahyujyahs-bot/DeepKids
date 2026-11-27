# Speed perspectives video (3D Ink and Toon, three.js)
- `film.html`: all 12 scenes + the frame driver (`seek(t)`). Needs `npm i three` next to it (importmap to node_modules/three) and the `shots/` folder.
- `render.js <worker> <n>`: renders frames (15 fps, drawn on twos) with headless Chromium; run 4 workers, then ffmpeg (see mkaudio.sh for the voice).
- `lines.txt`: Alba (Piper en_GB-alba-medium) voice lines for scenes 1-11. Scene 12 is the founder's own recording (not yet added).
- `shots/`: slices of the real speed-unit screens used in scenes 11 and 12.
