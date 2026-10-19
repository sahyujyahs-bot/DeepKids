# DeepKids Home Planner (prototype)

Single-page prototype: Science Level 1 topics (age 6–7) mapped to NCERT, Cambridge Primary and NIOS, with curated resources, a self-adjusting planner, ongoing-experiment reminders and a progress tracker.

- `index.html`: the page (published as a claude.ai artifact; it saves progress privately per user via the artifact `db` capability, falling back to browser storage).
- `build/`: source data and template. Rebuild with:
  `python3 build/make_data.py > build/data.json && python3 -c "t=open('build/template.html').read();open('index.html','w').write(t.replace('/*DATA*/',open('build/data.json').read()))"`

Board chapter titles were gathered from secondary listings and still need checking against the official books.
