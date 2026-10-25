# Open textbooks knowledge base

42 open textbooks (10,891,105 words, 5,970 sections) whose full source is published on GitHub, extracted and linked to every subtopic of the DeepKids curriculum map (`app/content/curriculum/`). They are written for teenagers and adults; DeepKids uses them as the deepest, most accurate reference behind lessons for 6–10 year olds.

Only github.com is reachable from the build environment, so books whose source lives elsewhere (OpenStax web, LibreTexts, CK-12, Wikibooks, Siyavula, NCERT) are not here.

## Files
- `catalog.json`: every book with its licence and what we may do with it.
- `index/<book>.json`: chapter and section titles and key terms (and learning objectives for freely reusable books).
- `by_subtopic.json`: for each subtopic in the curriculum, the best 8 sections across all books and the key terms they teach. **Start here when writing a lesson.**
- `text/<book>.jsonl.gz`: full text of the books we may reuse (CC BY), committed.
- `.cache/text/<book>.jsonl`: full text and glossary of every book. Not committed: rebuild with `python3 knowledge/fetch_and_extract.py` (takes under a minute), then `python3 knowledge/map_to_curriculum.py`.

## Licence rules (DeepKids Plus is a paid product)
- **reuse** (CC BY): text may be adapted into lessons, with credit ("Adapted from <book>, OpenStax, CC BY 4.0").
- **share-alike** (CC BY-SA, GFDL): adapting text would force our lesson under the same licence. Use for facts and ideas; write our own words.
- **reference** (CC BY-NC, CC BY-NC-SA: most OpenStax books on GitHub carry this): research only. Facts and ideas are free to use; never copy or closely paraphrase the text, figures or exercises.
- *Mathematics for Machine Learning* was found but left out: it is free to read but not openly licensed.

| Book | Subject | Licence | Use | Sections | Words | Source |
|---|---|---|---|---|---|---|
| Physics | sci | CC BY 4.0 | **reuse** | 100 | 220,124 | [source](https://github.com/openstax/osbooks-physics) |
| Statistics | math | CC BY 4.0 | **reuse** | 101 | 208,302 | [source](https://github.com/openstax/osbooks-statistics) |
| Biology 2e | sci | CC BY-NC-SA 4.0 | **reference** | 259 | 493,450 | [source](https://github.com/openstax/osbooks-biology-bundle) |
| Biology for AP® Courses | sci | CC BY-NC-SA 4.0 | **reference** | 209 | 438,847 | [source](https://github.com/openstax/osbooks-biology-bundle) |
| Concepts of Biology | sci | CC BY-NC-SA 4.0 | **reference** | 107 | 202,774 | [source](https://github.com/openstax/osbooks-biology-bundle) |
| Microbiology | sci | CC BY-NC-SA 4.0 | **reference** | 159 | 331,023 | [source](https://github.com/openstax/osbooks-microbiology) |
| Anatomy and Physiology 2e | sci | CC BY-NC-SA 4.0 | **reference** | 198 | 441,043 | [source](https://github.com/openstax/osbooks-anatomy-physiology) |
| Chemistry 2e | sci | CC BY-NC-SA 4.0 | **reference** | 149 | 331,397 | [source](https://github.com/openstax/osbooks-chemistry-bundle) |
| Chemistry: Atoms First 2e | sci | CC BY-NC-SA 4.0 | **reference** | 149 | 334,293 | [source](https://github.com/openstax/osbooks-chemistry-bundle) |
| Organic Chemistry | sci | CC BY-NC-SA 4.0 | **reference** | 342 | 181,779 | [source](https://github.com/openstax/osbooks-organic-chemistry) |
| University Physics Volume 1 | sci | CC BY-NC-SA 4.0 | **reference** | 124 | 288,766 | [source](https://github.com/openstax/osbooks-university-physics-bundle) |
| University Physics Volume 2 | sci | CC BY-NC-SA 4.0 | **reference** | 119 | 226,561 | [source](https://github.com/openstax/osbooks-university-physics-bundle) |
| University Physics Volume 3 | sci | CC BY-NC-SA 4.0 | **reference** | 95 | 175,085 | [source](https://github.com/openstax/osbooks-university-physics-bundle) |
| College Physics 2e | sci | CC BY-NC-SA 4.0 | **reference** | 283 | 562,373 | [source](https://github.com/openstax/osbooks-college-physics-bundle) |
| College Physics for AP® Courses 2e | sci | CC BY-NC-SA 4.0 | **reference** | 283 | 580,044 | [source](https://github.com/openstax/osbooks-college-physics-bundle) |
| Astronomy 2e | sci | CC BY-NC-SA 4.0 | **reference** | 199 | 400,194 | [source](https://github.com/openstax/osbooks-astronomy) |
| Psychology 2e | sci | CC BY-NC-SA 4.0 | **reference** | 105 | 299,656 | [source](https://github.com/openstax/osbooks-psychology) |
| Elementary Algebra 2e | math | CC BY-NC-SA 4.0 | **reference** | 82 | 181,350 | [source](https://github.com/openstax/osbooks-prealgebra-bundle) |
| Intermediate Algebra 2e | math | CC BY-NC-SA 4.0 | **reference** | 83 | 203,319 | [source](https://github.com/openstax/osbooks-prealgebra-bundle) |
| Prealgebra 2e | math | CC BY-NC-SA 4.0 | **reference** | 75 | 150,044 | [source](https://github.com/openstax/osbooks-prealgebra-bundle) |
| Algebra and Trigonometry 2e | math | CC BY-NC-SA 4.0 | **reference** | 94 | 323,167 | [source](https://github.com/openstax/osbooks-college-algebra-bundle) |
| College Algebra 2e | math | CC BY-NC-SA 4.0 | **reference** | 69 | 249,658 | [source](https://github.com/openstax/osbooks-college-algebra-bundle) |
| College Algebra with Corequisite Support 2e | math | CC BY-NC-SA 4.0 | **reference** | 69 | 249,645 | [source](https://github.com/openstax/osbooks-college-algebra-bundle) |
| Precalculus 2e | math | CC BY-NC-SA 4.0 | **reference** | 87 | 292,366 | [source](https://github.com/openstax/osbooks-college-algebra-bundle) |
| Calculus Volume 1 | math | CC BY-NC-SA 4.0 | **reference** | 55 | 129,638 | [source](https://github.com/openstax/osbooks-calculus-bundle) |
| Calculus Volume 2 | math | CC BY-NC-SA 4.0 | **reference** | 54 | 118,604 | [source](https://github.com/openstax/osbooks-calculus-bundle) |
| Calculus Volume 3 | math | CC BY-NC-SA 4.0 | **reference** | 54 | 151,422 | [source](https://github.com/openstax/osbooks-calculus-bundle) |
| Introductory Business Statistics 2e | math | CC BY-NC-SA 4.0 | **reference** | 77 | 166,241 | [source](https://github.com/openstax/osbooks-introductory-statistics-bundle) |
| Introductory Statistics 2e | math | CC BY-NC-SA 4.0 | **reference** | 102 | 199,381 | [source](https://github.com/openstax/osbooks-introductory-statistics-bundle) |
| Contemporary Mathematics | math | CC BY-NC-SA 4.0 | **reference** | 119 | 228,773 | [source](https://github.com/openstax/osbooks-contemporary-mathematics) |
| Introduction to Philosophy 2e | phil | CC BY-NC-SA 4.0 | **reference** | 66 | 171,852 | [source](https://github.com/openstax/osbooks-introduction-philosophy) |
| World History Volume 1, to 1500 | hist | CC BY-NC-SA 4.0 | **reference** | 85 | 259,898 | [source](https://github.com/openstax/osbooks-world-history) |
| World History Volume 2, from 1400 | hist | CC BY-NC-SA 4.0 | **reference** | 80 | 253,935 | [source](https://github.com/openstax/osbooks-world-history) |
| The Open Logic Text | math | CC BY 4.0 | **reuse** | 14 | 331,714 | [source](https://github.com/OpenLogicProject/OpenLogic) |
| OpenIntro Statistics | math | CC BY-SA | **share-alike** | 51 | 154,953 | [source](https://github.com/OpenIntroStat/openintro-statistics) |
| APEX Calculus | math | CC BY-NC | **reference** | 80 | 227,336 | [source](https://github.com/APEXCalculus/APEXCalculus_Source) |
| Applied Combinatorics (Keller & Trotter) | math | CC BY-SA | **share-alike** | 189 | 130,684 | [source](https://github.com/mitchkeller/applied-combinatorics) |
| Abstract Algebra: Theory and Applications (Judson) | math | GFDL | **share-alike** | 225 | 207,542 | [source](https://github.com/twjudson/aata) |
| A First Course in Linear Algebra (Beezer) | math | GFDL | **share-alike** | 179 | 300,721 | [source](https://github.com/rbeezer/fcla) |
| Discrete Mathematics: An Open Introduction (Levin) | math | CC BY-NC-SA | **reference** | 157 | 251,658 | [source](https://github.com/oscarlevin/discrete-book) |
| Introduction to Modern Statistics (OpenIntro) | math | CC BY-SA | **share-alike** | 146 | 108,942 | [source](https://github.com/OpenIntroStat/ims) |
| CS Unplugged (computer science without computers, ages 5-14) | math | CC BY-SA | **share-alike** | 697 | 132,551 | [source](https://github.com/uccser/cs-unplugged) |
