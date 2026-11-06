export const meta = {
  name: 'lean-unit-media',
  description: 'One Fable helper per unit: draws the set-up cards and a capped number of card pictures in code, in one pass',
  phases: [{ title: 'Draw', model: 'fable' }],
}
const ART = '/tmp/claude-0/-home-user-DeepKids/18f856a9-7fa3-51d7-9eac-5c0fcd1b9c10/scratchpad/art'
const R = '/home/user/DeepKids'
const N = { type: 'object', properties: { unit: { type: 'string' }, setup: { type: 'number' }, cards: { type: 'number' }, note: { type: 'string' } }, required: ['unit', 'setup', 'cards'] }
const camel = (s) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
const res = await pipeline(args, (x) => {
  const uid = x.f.replace(/\.json$/, '')
  const mod = 'ic_' + camel(uid.replace(/^sci\./, '').replace(/\.L(\d)$/, 'L$1'))
  return agent(`Draw the missing pictures for ONE DeepKids science unit, ${uid} (${R}/app/content/units/sci/${x.f}), in code, in ONE pass. Quality matters more than speed: the founder rejected an earlier batch for people with randomly placed limbs and objects at wrong positions and angles.

Style engine: ${ART}. Read ${ART}/src/canvas-core/flatKit.ts once, and only the first 150 lines of ${ART}/src/canvas-core/moongFlat.ts (a worked example). Do not read anything else there.

What to draw, in this order (keys exactly; skip any key already in ${R}/app/content/units/sci/${uid}.art.json whose file exists):
1. Set-up cards: every experiment step x.setup[j] without a "scene" field -> key setup.<experiment id>.<j> ("art" says what to draw, "caption" what it shows). About ${x.s} cards.
2. Then at most 10 card pictures, most important first: flow.<id> for each experiment/activity/project, then term.<i> and expl.<i> for the things a child can SEE (real objects, animals, actions). Skip abstract ideas.
Photos: do not search for photos at all. Everything is drawn.

How: write ${ART}/src/canvas-core/${mod}.ts (import from "./flatKit"; one function per picture; export const ${mod} = cards("${uid}", [ ... ]) with setup cards first) and ${ART}/src/hosts/page-${mod}.ts (import { ${mod} } from "../canvas-core/${mod}"; import { mountFilm } from "./page"; mountFilm(${mod});).
Render ALL frames in ONE call: cd ${ART} && node tools/still.mjs ${mod} --frames 0,1,2,...  Then CHECK YOUR WORK PROPERLY: make contact sheets with PIL of at most 6 pictures each, 3 per row, each picture 520 px wide, and Read every sheet. For EACH picture go through this checklist and write one line per picture in your head before accepting it:
 - People: draw every person with person() and tell it where each HAND goes: person(c, x, y, h, { reachR: [hx, hy], reachL: [hx, hy] }). The arm is solved to join the shoulder and end exactly there, and person() RETURNS the real hand points ({handL, handR}); draw the held thing (torch, spoon, cup, book, seed) AT that returned point, with its handle in the hand, never somewhere near it. Pick hand targets within about 0.33 x the person's height of the shoulder (a longer reach is cut short). Use armL / armR angles only for an arm that hangs free or waves. Never let a hand target be across the body unless the person really crosses an arm. For sitting use { sit: true, dir: 1 or -1 } with the legs running toward dir, and put what they play with in front of them on the floor, within reach. Feet stand on the ground line. The child and the grown-up look the same in every card; people face the viewer. Look at each person on the contact sheet and ask: could a real child hold this pose? If an arm or leg looks broken or random, change the targets, do not accept it.
 - Pointing and looking: a pointing hand goes on the line from the shoulder toward the thing pointed at; a torch or pointer must be AIMED at its target (the beam or the line ends on it).
 - Objects: each object has the right size relative to the others, rests on a surface or is held (never floating), is drawn at the angle the action needs (a tilted jug pours downhill, a ramp slopes, a swing hangs from its rope), and shows the right side (the open side of a cup faces up). Arrows start at the thing that moves and point the way it moves.
 - Nothing cut off by the frame, nothing overlapping by accident, the main thing big and central.
 - The science is correct and matches the card's "art" and "caption" exactly.
If a picture fails ANY point, fix it and re-render only that frame. Up to TWO fix rounds; after that, drop a picture that is still wrong rather than keep it. A weaker picture count is better than a wrong picture.
Install each: python3 ${R}/app/build/add_drawing.py ${uid} <key> ${ART}/out/still-${mod}-<n>.png ; then copy ${mod}.ts to ${R}/app/build/drawings/. Do not change the unit's text. No git, no builds, no tests.
Final answer: unit, set-up count, card count, and in under 30 words what you skipped.`, { label: uid.replace(/^sci\./, ''), phase: 'Draw', model: 'fable', schema: N })
})
const ok = res.filter(Boolean)
log(`${ok.length} units: ${ok.reduce((a, r) => a + r.setup, 0)} set-up drawings, ${ok.reduce((a, r) => a + r.cards, 0)} card pictures`)
return ok
