export const meta = {
  name: 'lean-unit-media',
  description: 'One Fable helper per unit: draws the set-up cards and a capped number of card pictures in code, in one pass',
  phases: [{ title: 'Draw', model: 'fable' }],
}
const ART = '/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/art'
const R = '/home/user/DeepKids'
const N = { type: 'object', properties: { unit: { type: 'string' }, setup: { type: 'number' }, cards: { type: 'number' }, note: { type: 'string' } }, required: ['unit', 'setup', 'cards'] }
const camel = (s) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
const res = await pipeline(args, (x) => {
  const uid = x.f.replace(/\.json$/, '')
  const mod = 'ic_' + camel(uid.replace(/^sci\./, '').replace(/\.L(\d)$/, 'L$1'))
  return agent(`Draw the missing pictures for ONE DeepKids science unit, ${uid} (${R}/app/content/units/sci/${x.f}), in code, in ONE pass. Be efficient: every extra read, render or retry costs money.

Style engine: ${ART}. Read ${ART}/src/canvas-core/flatKit.ts once, and only the first 150 lines of ${ART}/src/canvas-core/moongFlat.ts (a worked example). Do not read anything else there.

What to draw, in this order (keys exactly; skip any key already in ${R}/app/content/units/sci/${uid}.art.json whose file exists):
1. Set-up cards: every experiment step x.setup[j] without a "scene" field -> key setup.<experiment id>.<j> ("art" says what to draw, "caption" what it shows). About ${x.s} cards.
2. Then at most 10 card pictures, most important first: flow.<id> for each experiment/activity/project, then term.<i> and expl.<i> for the things a child can SEE (real objects, animals, actions). Skip abstract ideas.
Photos: do not search for photos at all. Everything is drawn.

How: write ${ART}/src/canvas-core/${mod}.ts (import from "./flatKit"; one function per picture; export const ${mod} = cards("${uid}", [ ... ]) with setup cards first) and ${ART}/src/hosts/page-${mod}.ts (import { ${mod} } from "../canvas-core/${mod}"; import { mountFilm } from "./page"; mountFilm(${mod});).
Render ALL frames in ONE call: cd ${ART} && node tools/still.mjs ${mod} --frames 0,1,2,...  Make ONE contact sheet of all (PIL, 300 px wide each, rows of 5) and Read it once. At most ONE fix round, and only for pictures that are clearly wrong (wrong objects, cut off, confusing); drop a picture rather than redraw twice.
Bar: main object big and central, the action shown with a red arrow() where useful, numbers only via write(), no words as text, same child and grown-up in every card, nothing cut off or floating, correct science.
Install each: python3 ${R}/app/build/add_drawing.py ${uid} <key> ${ART}/out/still-${mod}-<n>.png ; then copy ${mod}.ts to ${R}/app/build/drawings/. Do not change the unit's text. No git, no builds, no tests.
Final answer: unit, set-up count, card count, and in under 30 words what you skipped.`, { label: uid.replace(/^sci\./, ''), phase: 'Draw', model: 'fable', schema: N })
})
const ok = res.filter(Boolean)
log(`${ok.length} units: ${ok.reduce((a, r) => a + r.setup, 0)} set-up drawings, ${ok.reduce((a, r) => a + r.cards, 0)} card pictures`)
return ok
