# Compiling and checking a card's tracking target

A `.mind` target is the only thing standing between a card and the AR
working at all. If it was built from different artwork than the card in
someone's hand, nothing downstream can save it, and the symptoms look
exactly like a tracking bug: `anchor ----` in `/ar/?debug` with the
card filling the frame. That happened to `sci1002`, and these scripts
are what settled it and fixed it.

## Setup

MindAR's compiler is not in the shipped bundle, and two of its pieces
assume a browser. Three small shims and it runs in Node:

```
npm install --ignore-scripts mind-ar@1.2.5 @tensorflow/tfjs @napi-rs/canvas
```

1. **`canvas`** — the offline compiler imports node-canvas, which has
   no prebuild on most machines and needs a toolchain. Put a module at
   `node_modules/canvas` re-exporting `@napi-rs/canvas`, which ships a
   binary:
   `export { createCanvas, loadImage, Image, ImageData } from '@napi-rs/canvas';`
2. **The workers** — `controller.js` and `compiler.js` import
   `./*.worker.js?worker&inline`, a Vite-only suffix. Copy
   `controller.worker.node.js` (here) next to them and point
   `controller.js` at it; stub `compiler.js`'s the same way.
3. **`input-loader.js`** — its fast path is a hand-written WebGL
   program that reads `backend.texData`, so it only runs on a GPU. Set
   `this.cpu = tf.getBackend() !== 'webgl'`, return early in the
   constructor, and in `loadInput` draw to the 2d canvas and build the
   grey tensor from `getImageData` instead.

## Compiling

```
node compile.mjs ../targets/sci1002.mind <card-back.png> [more-printings.png ...]
```

Several sources become several targets in one file; `cards.json` says
how many with `targets` and the page adds an anchor for each, so one
card can be recognised in more than one printing.

Takes about 25s for a 1140x1540 image. Feed it the **print artwork**
where possible. A photo works — `sci1002.mind` is currently built from
one — but it carries the glare, the blur and whatever the room
lighting did to the colours, so it will never match clean art.

If all you have is a photo: `rectify.py` finds the card and flattens
it, `crop.py` trims to the orange border and squares up the
proportions. Check the result by eye before compiling; both lean on
colour thresholds and will happily hand you the glow around the card
instead of the card.

**The photo matters more than anything done to it afterwards.** Card
flat on a plain surface, even light with no glare, camera straight
above and the card filling the frame, tapped to focus. A frame grabbed
off a video preview — which is what `sci1002`'s second target is built
from — is soft at exactly the fine scales the tracker leans on when
the angle changes, which is why it holds head-on and lets go as soon
as the phone moves.

Stacking several such frames does not rescue it: aligning them needs
the detail that is missing, so the homographies come out of five or six
points and the result is worse than any single frame. Tried, measured,
not worth repeating. Take one good photo instead.

## Checking it before anyone has to hold a phone

```
node validate.mjs ../targets/sci1002.mind photo1.jpg photo2.jpg ...
```

Runs MindAR's own detector and matcher over stills. `recognised: YES`
is the same thing as `anchor SEEN` on a phone. Use photos the target
was **not** built from, at a few angles. For the Noether card:

```
                        old target (repo art)   new target (from a photo)
  four phone photos            0 of 4                   3 of 4
```

The remaining miss is a frame with AR artwork drawn over the card.

`match.py` is the quicker, cruder check — ORB features surviving a
ratio test and one perspective fit. It will not tell you whether MindAR
can track something, but a count in single figures against a photo of
the card means the artwork is simply wrong, and it takes a second:

```
  art vs the same art warped, blurred, brightened : 1537
  one photo of a card vs another of the same card :  965-3193
  repo art vs the card actually in someone's hand :    1-5
```
