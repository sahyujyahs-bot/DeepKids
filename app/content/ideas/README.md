# The DeepKids notebook (ideas bank)

These files come from the founder's own notes, uploaded to the repository's main branch: the spreadsheets (Grade Concepts, HomeSchooling Track, SCI Cards, Evolution Picture Book, Guided Journals, Content Calendar, Director's Dilemma, History Board Game, DeepKids V0.1) and the PDFs (RNA story, Science Concepts, Physics, I Am World, Storyboarding Game, the Deep Kids pitch, the HST Curriculum).

- `python3 app/build/ideas/extract.py <folder with the uploaded files>` rebuilds the JSON files here.
- `python3 app/build/ideas/build.py` maps them onto Combined topics. It writes `by_topic/<topic>.md`, a full digest that lesson writers read first, and `app/build/ideas/notebook.json`, which the app shows in each Combined lesson's "From the DeepKids notebook" tab.

| File | What it holds |
|---|---|
| grade_concepts.json | 29 big ideas × Grades 1–5, each with concept, philosophical truth, salient points, debated aspects, exceptions, in art/life, in nature |
| concept_activities.json | 114 concepts, each with experiments, home, outdoors, dance, drama, painting, music, yoga, games, reading, writing, craft, parent scripts |
| scientists.json | 160 SCI Cards: the scientist card game, with stories, "what it whispers", tags (Underdog, Invisible Giant…) and scores |
| gravity_points.json, force_cards.json, gravity_voices.json, notes.json | the gravity and forces track behind the Escape Gravity board game |
| evolution.json, rna_story.json | the Evolution picture book (pages, species ladder, body systems) and RNA's story of life |
| journal_pages.json | the 120-page Science Journal for ages 6–9 |
| games.json, activity_weeks.json, world.json | game designs, the weekly activity journeys, the I Am world, curriculum lists and principles |

Read ACCURACY.md before using anything here with children.
