# DeepKids science resource library

This is a tagged library of free, good-quality science resources for children aged 6–12, made of links and short descriptions. We store links, never copies, because most material is copyrighted.

- **Files:** `app/resources/<group>.json`, where each file is a JSON list of resources.
- **Concepts:** `app/resources/concepts.json` lists the 44 concepts and the board chapters each one reaches.
- **Check:** `python3 app/build/validate_resources.py app/resources/<file>.json`

```jsonc
{
  "title": "Balloons and Static Electricity",
  "url": "https://phet.colorado.edu/en/simulations/balloons-and-static-electricity",
  "source": "PhET, University of Colorado Boulder",
  "type": "sim",            // sim | worksheet | experiment | activity | video | game | reading | lesson | tool | citizen-science
  "ages": [8, 12],          // youngest and oldest it suits, within 6–12
  "access": "free",         // free | free-account | freemium | paid
  "lang": ["en"],           // languages offered, e.g. ["en", "hi", "ta"]
  "desc": "One or two plain sentences: what the child actually does and sees.",
  "how": "One sentence for the parent: when and how to use it (optional).",
  "concepts": ["electricity-and-staying-safe-with-it"],   // 1–3 ids from concepts.json
  "chapters": []            // optional extra chapter keys (e.g. "ncert|sci|4|7") when the fit is specific
}
```

### Other subjects

Maths, English, Hindi, thinking and coding resources (and whole-site science resources) use `subj` and `strands` instead of `concepts`:

```jsonc
"subj": "math",               // sci | math | eng | hin | think | code | all, or a list like ["eng", "hin"]
"strands": ["fractions"]      // math: number, operations, fractions, measurement, time-money, shapes, patterns, data, reasoning, all-maths
                              // eng: phonics, reading, stories, vocabulary, grammar, writing, speaking, all-english
                              // hin: varnamala, reading, stories, poems, writing, all-hindi
                              // think: thinking, philosophy · code: coding, unplugged · sci: all-science · all: textbooks, all-subjects
```

`subj` defaults to "sci". Science resources still use `concepts`; a whole-site science resource may use `"strands": ["all-science"]` instead.

## Rules

1. **Real links only.** Every URL must have appeared in a web search result you saw. Never build, guess or "fix" a URL. A homepage is fine only when the whole site is the resource. Otherwise link the specific page.
2. **Accurate descriptions.** Describe only what the search result or the page shows. If you can't tell what the child does, leave the resource out.
3. **Quality over quantity.** Pick resources a thoughtful parent would actually use: free or cheap, safe, ad-light, and suitable for 6–12. Prefer Indian sources and Indian languages where they are good.
4. **Tagging.** Each resource gets 1–3 concepts, using only ids from concepts.json. Add `chapters` only for a specific fit beyond the concept.
5. **No duplicates.** One URL, one entry.
6. **Indian context.** Resources should work in India. Mark anything that needs a paid account or isn't available in India.
