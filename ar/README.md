# SCI. cards in AR

A kid opens `deepkids.in/ar` on a phone, picks the scientist they are
holding, points the camera at the **back** of the card, and the card
wakes up: the constellation draws its own lines and the nodes light,
the story artwork lifts off the page in layers, and the longer story —
the part that is not printed anywhere on the card — slides up.

No app, no QR code, nothing to reprint. It runs in the browser.

## What is here

| | |
|---|---|
| `index.html` | the experience: pick a card, scan it, read the story |
| `calibrate.html` | click-to-place tool for a card's constellation |
| `studio.html` | arrange the story artwork and text in 3D over a card |
| `cards.json` | everything the page knows about each card |
| `targets/<code>.mind` | the compiled tracking target for one card |
| `vendor/` | MindAR 1.2.5 and three.js r160, self-hosted |

## Why one target file per card

A `.mind` target is about 750KB. All 42 cards in one file would be a
31MB download before anything could be recognised. So the kid says
which card they have first, and only that card's target loads.

This is also why there is no QR code: the cards are already printed,
and picking a face off a grid is friendlier than typing a code anyway.

## Adding a card

1. **Compile its target.** Open MindAR's compiler
   (`hiukim.github.io/mind-ar-js-doc/tools/compile`), drop in the card
   **back** at its print resolution, download the `.mind`, and save it
   as `targets/<code>.mind` — `sci1003`, `sci1004` and so on, matching
   the code printed at the bottom right of the card.
2. **Place the constellation.** Open `/ar/calibrate.html`, pick the
   card, click each star, name it, type what the card says about them,
   and mark the centre. Add the cross-links the card draws between
   people who are not the centre.
3. **Write the longer story** in the same tool.
4. **Copy the JSON** it gives you over that card's entry in
   `cards.json`. Add a new entry first if the card is not listed yet.

## The story artwork and the text: /ar/studio.html

Open the studio, pick a card, and arrange what stands up off it.

- **Drop the layer images in.** Export each part of the scene from
  Procreate as its own transparent PNG or WebP at the same canvas
  size, then drag them into the studio. They appear straight away.
- **Move them in space.** Select a layer and set X, Y and Z, or nudge
  with the arrow keys (PageUp/PageDown for height). Scale, turn and
  fade each one.
- **Lean them.** *Lean back/forward* and *swing left/right* take a
  layer out of the card's plane. Flat layers only slide against each
  other; leant, they read as cut-outs standing on a stage, which is
  what there is to see when the scene is turned round.

  Go easy on both lean and height over the card. A layer at z 0.24
  shifts about 5mm across a 6cm card when the phone tilts 20°, which
  stops reading as depth and starts reading as the artwork coming
  unstuck. Noether's layers sit at 0.03, 0.08 and 0.14 for that
  reason. Depth is cheap in **Look Around It**, where the scene is
  turned on purpose, and expensive on the card, where it is supposed
  to look nailed down.
- **Add text and put it where you want it.** Same controls — a block
  of text is just another thing in the scene, so it can float above
  the card, sit beside it, or lie flat on it.
- **Phone view** frames it as the camera will. **Orbit** swings round
  so the depth between layers is visible. **Card** hides the card.
- **Move things by dragging them.** Drag a layer to slide it around,
  shift-drag to lift it towards the reader, drag the background to
  swing the camera. Arrow keys nudge; PageUp/PageDown change height.
- **Download cards.json** when it looks right and commit it. The
  arrangement is also kept in your browser as you work, so a reload
  does not lose it.

The images themselves are a separate job: the studio can only hold
them in the browser, so they have to be committed to the repo at the
paths it lists, under `/ar/layers/<code>/`. A layer whose picture is
not there yet comes back as a pink outline, so it is obvious what is
still missing.

### The units

Everything is in card-widths. The card runs -0.5 to 0.5 across and
-0.68 to 0.68 up; **z is height above the card, towards the reader**.
Keep layers under about 0.3 — past that the parallax detaches from
the card and the illusion goes. Text can go further, since it is
meant to float.

Lean and swing are in degrees and default to none, so a scene
arranged before they existed comes through exactly as it was.

## What the scene is meant to be

From the reference: the card stays as printed, and what AR adds is
everything that is **not** on it.

- **The story art comes forward.** Cut the lower scene into its parts
  — the figure, the blackboard, the audience — and bring them off the
  card towards the reader, larger than they are printed, so the card
  becomes a little stage.
- **The text floats above the card** on a dark panel, not over the
  artwork.
- **Motes drift around it**, which is most of what sells the thing as
  standing in space rather than lying flat.

- **It stays on the card.** Worth being clear about what the job is,
  because the obvious intuition is wrong and cost two rounds here. If
  the phone shakes, the card in the picture shakes with it, so artwork
  glued to the card shakes too and nobody sees anything amiss. What
  reads as the artwork moving is it moving *differently* from the
  card, and only the tracker's own frame-to-frame noise does that.
  Everything else — hand tremor included — is to be followed exactly.

  So the smoothing is light, and the numbers are measured rather than
  guessed: against a noisy pose the artwork sits 0.0031 card-widths
  and 0.20° from where the card really is, against 0.0036 and 0.26°
  for using the pose raw. Smoothing harder makes it *worse* — 0.0047
  at the setting this briefly shipped — because the lag costs more
  than the noise it removes, and the artwork then swims on the card.
  `scratchpad/ar/reg.cjs` is the measurement; `follower()` carries the
  reasoning, including why the tracker's own filter cannot do this.
- **It does not blink.** A card in a hand goes unseen for a frame or
  two constantly. Rather than snapping out and back with the anchor,
  the artwork holds its place for about four tenths of a second and
  then fades.

### Look around it

Walking round a card held in one hand is not really on, and tracking
is the first thing to go at a steep angle. So **Look Around It** lifts
the scene off the card and parks it in front of the camera, where a
finger turns it and no tremor reaches it at all.

Flat pictures swung far enough go edge-on and vanish, so as the scene
turns each layer turns most of the way back towards the viewer while
its *position* goes the whole way round. The depth between the layers
is then what is on show, and the art never narrows to a line. The text
panel stands down while this is happening — the same words are in the
sheet at the bottom of the screen — so the picture gets the frame.

Deliberately **not** done: lighting up the constellation. It is
printed on the card already, so an AR copy landed a hair off the
original and, with any tracking jitter at all, read as a smeared
flicker. `constellation.show` turns it back on per card if ever
wanted.

## Before this goes live

It is `noindex` and linked from nowhere on purpose: the tracking has
not yet been run against a real card in a real hand. To launch it,
confirm it on a phone, then set `robots` to `index, follow` in
`index.html`, add `/ar` to `sitemap.xml`, and link it from `/sci`.

`/ar/?debug` prints what the device reported — WebGL2, float textures,
the renderer name and the user agent — which is what to send if a
phone cannot run it. While scanning it also keeps a live readout over
the camera: frames and fps, whether the anchor is seen, whether the
artwork is showing, the fade, the pose scale, how many unusable poses
have been skipped and any error the render loop caught. Screenshot it,
or tap it to copy. There is no way to run the tracker anywhere but on
a phone, so that readout is the whole of the evidence.

The filter can be tried without a deploy: `?calm=`, `?keen=`, `?move=`,
`?turn=`, `?win=` and `?hold=` override the constants in `follower()`.
