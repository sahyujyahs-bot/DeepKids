# The two DeepKids tracks

DeepKids has exactly two tracks. Older names in the code and docs map onto them as shown below.

| | **1. Board track** | **2. DeepKids track** |
|---|---|---|
| What it is | The lesson plan follows the family's chosen book (NCERT, Cambridge, NIOS), chapter by chapter, page by page. | DeepKids' own syllabus. It covers everything every board teaches in that class, so the child is ready for any board, and needs no textbook. |
| Order | The book's order. | Topics climb a ladder from Class 1 to 5. Each topic is split into subtopic-level units. |
| On top of the book | The DeepKids layer (below). | The DeepKids layer, written in full. |
| Files | `app/content/<board>/<subj>-L<class>-<nn>.json` (format: `SPEC.md`) | Topic overview: `app/content/combined/<subj>-C<class>-<topic>.json` (format: `SPEC.md`, "Combined topics"). Units: `app/content/units/<subj>/<id>.json` (format: `units/SPEC_UNIT.md`) |
| Older names | "Board chapter", "chapter pack" | "DeepKids Combined", "DeepKids depth", "the full DeepKids way", "rung", "The Deep End" |

**How the DeepKids track is built.** A *topic* at a class (for example Forces, Class 3) has one overview: its story, big ideas, game, project and books. The topic is taught through its *units* (Friction, Push and pull, Simple machines and so on), each a full feed of 25 elements. While a topic still has no units, its overview is the lesson. Once the units exist, the overview becomes the topic's front page and the units are its lessons.

**How the board track uses the units.** When a board chapter teaches the same idea as a DeepKids unit, the chapter links to it ("Go deeper with the DeepKids unit"). The board family keeps the book's order and borrows any part of the unit: the song, games, worksheets, story, or the Roots card.

## The DeepKids layer (both tracks)

Every board chapter and every DeepKids unit carries all of these:

- **Play:** jokes, the topic's song, games, worksheets, quizzes.
- **Talk:** questions to ask during the day, at meals and on walks.
- **Think:** big and deep questions with no single answer.
- **Question:** challenging perspectives, controversial ideas and live debates, with the evidence on each side. Credit to the women and underdogs the usual story leaves out.
- **Roots:** the philosophical and spiritual context of the idea, tied to the three questions every pursuit is really asking (see `PHILOSOPHY.md`).

The rules for all of it are in `SPEC.md` ("The DeepKids way"), `WRITING.md` and `PHILOSOPHY.md`.

## Who can see what
Everything is open to every family, whichever track they chose:
- **DeepKids track:** every topic, every class, every unit.
- **Board track:** every board (NCERT, Cambridge, NIOS, Waldorf), every class and every chapter, each with its DeepKids add-ons: the DeepKids units tagged to that chapter, open, with Add to plan. The other DeepKids units still show in the Library, locked ("On the DeepKids track"), so families see what the DeepKids track adds.

Beyond that, a family's track and pace only decide what the planner suggests by itself.
