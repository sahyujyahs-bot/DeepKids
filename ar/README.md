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
| `calibrate.html` | click-to-place tool for a card's constellation, and where the story text is written |
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

## The story artwork, in layers

`layers` on a card is empty until the layered exports exist. Export
each part of the lower scene from Procreate as its own transparent PNG
at the same canvas size, then list them back to front:

```json
"layers": [
  { "src": "/ar/layers/sci1001/sky.webp",       "w": 760, "h": 520, "depth": 0.00 },
  { "src": "/ar/layers/sci1001/observatory.webp","w": 760, "h": 520, "depth": 0.04 },
  { "src": "/ar/layers/sci1001/telescope.webp",  "w": 760, "h": 520, "depth": 0.09 }
]
```

`depth` is in card-widths towards the reader. Keep the furthest at 0
and the nearest under about 0.12 — past that the parallax detaches
from the card and the illusion goes.

## Before this goes live

It is `noindex` and linked from nowhere on purpose: the tracking has
not yet been run against a real card in a real hand. To launch it,
confirm it on a phone, then set `robots` to `index, follow` in
`index.html`, add `/ar` to `sitemap.xml`, and link it from `/sci`.

`/ar/?debug` prints what the device reported — WebGL2, float textures,
the renderer name and the user agent — which is what to send if a
phone cannot run it.
