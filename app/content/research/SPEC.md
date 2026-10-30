# Research for kids: one file per paper

Real research, retold for a parent and a child aged 6 to 10. One JSON file per paper: `app/content/research/<id>.json`.
`python3 app/build/combined/build.py` puts them all in data.json (`research`) and checks each one.

## Where papers come from
- **Frontiers for Young Minds** (kids.frontiersin.org): scientists write for children, kids review. CC BY: retell in our words, reuse figures with credit. Prefer "New Discovery" articles (one real study) over overviews.
- **New papers** found on PubMed, journals or university news (IISc, NCBS, IISER, ISRO, TIFR…): facts only, retold in our own words. Never copy their text. Use pictures only if public domain, CC0 or CC BY (Wikimedia Commons is fine), with credit.
- Indian research where we can find it.

## The file
```json
{
  "id": "ants-traffic",                      // file name, lowercase-with-dashes
  "title": "Why don't ants get stuck in traffic jams?",   // the question, as a child would ask it
  "blurb": "One line that makes a parent want to tap.",
  "topics": ["sci.animals.animal-societies.L3"],          // DeepKids unit ids it fits (from app/content/units/sci); can be units not written yet
  "tags": ["ants", "insects", "teamwork"],                // 2–5 plain words, used to match what the family likes
  "year": 2019,                                            // year of the research
  "mins": 6,                                               // reading time together
  "cover": { "src": "media/research/ants-traffic-1.jpg", "alt": "…", "credit": "Figure 1, Poissonnier et al., Frontiers for Young Minds, CC BY 4.0" },
  "source": { "name": "Frontiers for Young Minds", "title": "…", "authors": "…", "year": 2021, "url": "https://kids.frontiersin.org/…", "license": "CC BY 4.0" },
  "original": { "title": "…", "authors": "…", "journal": "…", "year": 2019, "url": "https://doi.org/…" },   // the scientists' own paper, if known
  "cards": [
    { "k": "q",     "t": "The question",          "b": "…" },
    { "k": "who",   "t": "Who found out",          "b": "Names, where they work, when." },
    { "k": "how",   "t": "How they found out",     "b": "What they did, step by step.", "img": { "src": "…", "alt": "…", "credit": "…" } },
    { "k": "found", "t": "What they found",        "b": "…" },
    { "k": "sure",  "t": "How sure are they?",     "b": "One study or many? What they don't know yet." },
    { "k": "why",   "t": "Why it matters",         "b": "…" },
    { "k": "try",   "t": "Try it at home",         "b": "A small, safe home version with things you have." },
    { "k": "think", "t": "Think about it",         "b": "A big question, ideally two sides to pick from." },
    { "k": "words", "t": "New words",              "words": [{ "w": "colony", "m": "a big group of ants living together" }] }
  ]
}
```
- All nine kinds, in this order. `t` may be reworded to fit (keep it short). `b` is 25 to 70 words, plain enough for a parent to read aloud once and a 7-year-old to follow.
- At least 2 cards have an `img`, and the cover is set. Images live in `app/content/media/research/<id>-N.jpg`, at most 900 px wide.
- Every image has a credit. Every fact comes from the source; if unsure, leave it out.

## Writing rules (from WRITING.md)
- Plain words, short sentences, no poetry where understanding is needed. Explain any hard word, and list it under "New words".
- Never call a living being "it": she, he or they.
- Real scientists keep their real names and genders. In the "try it" and "think" cards, any made-up people are mostly women and girls.
- An Indian example or link where it comes naturally (a lot of the South), never forced.
- Be honest about uncertainty: "how sure" is never "100% proven".
