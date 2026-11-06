# Set-up drawings

The pictures on experiment set-up cards are drawn in code, in one flat style: bold dark outlines, flat
colours, a darker tone on the shade side, light from the upper left. `flatKit.ts` holds the look and the
shared pieces (glass, bowl, plate, seed, leaf, hand, person, arrow, numbers); each unit has one module
whose cards are its set-up steps in order, and `moongFlat.ts` is the worked example.

They render with the anidoodle engine: copy `flatKit.ts` and a module into an anidoodle project's
`src/canvas-core/`, add its host page, then `node tools/still.mjs <module> --frames 0,1,...`. Each frame
is one card; `python3 app/build/add_drawing.py <unit id> setup.<experiment id>.<step> <png>` puts it in
the unit. A parent's own photo replaces a drawing (`--replace`).

## People
Draw people only with `person()` from `flatKit.ts`, and tell it where each hand goes: `person(c, x, y, h, { reachR: [hx, hy] })`.
The arm is solved so it joins the shoulder and ends exactly on that point, and `person()` returns the real hand points
(`{ handL, handR }`): draw the thing they hold at that point. Use `armL`/`armR` angles only for an arm that hangs free or waves.
A person sitting on the floor: `{ sit: true, dir: 1 | -1 }`. A grown-up: `{ adult: true }`. See `figTest.ts` for four worked poses
(holding a torch, pointing at the moon, tapping a tin with a spoon, two people sharing a book).
