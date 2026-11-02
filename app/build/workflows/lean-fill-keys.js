export const meta = {
  name: 'lean-fill-keys',
  description: 'One Fable helper per unit: draws exactly the listed picture slots in code, in one pass',
  phases: [{ title: 'Draw', model: 'fable' }],
}
const ART = '/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/art'
const R = '/home/user/DeepKids'
const N = { type: 'object', properties: { unit: { type: 'string' }, drawn: { type: 'number' }, note: { type: 'string' } }, required: ['unit', 'drawn'] }
const camel = (s) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
const res = await pipeline(args, (x) => {
  const uid = x.f.replace(/\.json$/, '')
  const mod = 'ic_' + camel(uid.replace(/^sci\./, '').replace(/\.L(\d)$/, 'L$1')) + 'Fill'
  return agent(`Draw specific missing pictures for ONE DeepKids science unit, ${uid} (${R}/app/content/units/sci/${x.f}), in code, in ONE pass. Be efficient: every extra read, render or retry costs money.

Style engine: ${ART}. Read ${ART}/src/canvas-core/flatKit.ts once, and only the first 150 lines of ${ART}/src/canvas-core/moongFlat.ts (a worked example). Read nothing else there.

Draw exactly these slots (and nothing else): ${x.keys.join(', ')}.
Meaning of a key: "intro" = the unit's cover picture (the Library card), showing what the unit is about, big and simple; "summary" = a second, different picture of the unit's main idea; "flow.<id>" = the experiment or project with that id in the unit's experiments/projects list (read it): show the experiment's key moment or the finished project, a parent understands it at a glance.
Do not search for photos. Everything is drawn.

How: write ${ART}/src/canvas-core/${mod}.ts (import from "./flatKit"; one function per picture; export const ${mod} = cards("${uid} fill", [ ... ])) and ${ART}/src/hosts/page-${mod}.ts (import { ${mod} } from "../canvas-core/${mod}"; import { mountFilm } from "./page"; mountFilm(${mod});).
Render ALL frames in ONE call: cd ${ART} && node tools/still.mjs ${mod} --frames 0,1,2,... Make ONE contact sheet (PIL, 300 px wide each, rows of 4) and Read it once. At most ONE fix round, only for pictures clearly wrong (wrong objects, cut off, confusing); drop a picture rather than redraw twice.
Bar: main object big and central, a red arrow() for movement or change, numbers only via write(), no words as text, correct science, nothing cut off or floating. Use the same child and grown-up style as other DeepKids cards.
Install each: python3 ${R}/app/build/add_drawing.py ${uid} <key> ${ART}/out/still-${mod}-<n>.png --replace ; then copy ${mod}.ts to ${R}/app/build/drawings/. Do not change the unit's text. No git, no builds, no tests.
Final answer: unit, number drawn, and in under 25 words what you skipped.`, { label: uid.replace(/^sci\./, ''), phase: 'Draw', model: 'fable', schema: N })
})
const ok = res.filter(Boolean)
log(`${ok.length} units, ${ok.reduce((a, r) => a + r.drawn, 0)} pictures`)
return ok
