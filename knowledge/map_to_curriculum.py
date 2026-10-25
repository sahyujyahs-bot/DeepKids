"""Link every subtopic of the DeepKids curriculum map to the best sections of the open textbooks.

  python3 knowledge/fetch_and_extract.py     (first: builds knowledge/.cache/text)
  python3 knowledge/map_to_curriculum.py
Writes knowledge/by_subtopic.json: for each subtopic, the top book sections (book, chapter, section, licence use,
match score) and the key terms those sections teach. Only references and terms, no book text, so it is safe to
commit whatever the book's licence. Writers then open the section text from the cache.
Matching: TF-IDF over section titles, objectives, key terms and text vs the subtopic's name, what each of its
levels covers, and the founder's notebook items it teaches. Sections from books of the same subject score higher.
"""
import json, os, glob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
HERE = os.path.dirname(os.path.abspath(__file__)); APP = os.path.join(os.path.dirname(HERE), 'app')
cat = {c['slug']: c for c in json.load(open(os.path.join(HERE, 'catalog.json')))}
docs, meta = [], []
for f in sorted(glob.glob(os.path.join(HERE, '.cache', 'text', '*.jsonl'))):
    slug = os.path.basename(f)[:-6]
    for line in open(f):
        s = json.loads(line)
        head = f"{s['section']} {s['section']} {s['chapter']} " + ' '.join(s['objectives']) * 2 + ' ' + ' '.join(s['key_terms']) * 2
        docs.append(head + ' ' + ' '.join(s['text'].split()[:2500]))
        meta.append(dict(id=s['id'], book=cat[slug]['title'], slug=slug, chapter=s['chapter'], section=s['section'], use=cat[slug]['use'],
                         subject=cat[slug]['subject'], terms=s['key_terms'][:25]))
vec = TfidfVectorizer(stop_words='english', sublinear_tf=True, max_df=0.3, min_df=2, ngram_range=(1, 2), max_features=400000)
X = vec.fit_transform(docs)
NB = json.load(open(os.path.join(APP, 'content', 'curriculum', 'notebook_items.json'))); NBI = {x['id']: x['text'] for v in NB.values() for x in v}
out, total = {}, 0
for subj in ('sci', 'math', 'hist', 'phil'):
    C = json.load(open(os.path.join(APP, 'content', 'curriculum', f'{subj}.json')))
    subs = {}
    for x in C['subtopic_levels']:
        k = f"{subj}.{x['topic']}.{x['subtopic']}"
        e = subs.setdefault(k, dict(name=x['name'], topic=x['topic_name'], q=[x['name'], x['name'], x['topic_name']], levels=[]))
        e['q'].append(x['covers']); e['levels'].append(x['level']); e['q'] += [NBI.get(n, '') for n in x['notebook']]
    keys = list(subs); Q = vec.transform([' '.join(subs[k]['q']) for k in keys]); S = linear_kernel(Q, X)
    for i, k in enumerate(keys):
        row = S[i].copy()
        for j, m in enumerate(meta):
            if m['subject'] == subj: row[j] *= 1.25
        top = row.argsort()[::-1][:10]
        hits = [dict(meta[j], score=round(float(row[j]), 3)) for j in top if row[j] > 0.04]
        seen, best = set(), []
        for h in hits:   # the same section often appears in two editions of a book: keep one
            sig = (h['section'].lower(), h['chapter'].lower())
            if sig in seen: continue
            seen.add(sig); best.append(h)
        terms = []
        for h in best[:5]:
            terms += [t for t in h['terms'] if t not in terms]
        out[k] = dict(name=subs[k]['name'], topic=subs[k]['topic'], levels=sorted(set(subs[k]['levels'])),
                      sections=[{a: h[a] for a in ('id', 'book', 'chapter', 'section', 'use', 'score')} for h in best[:8]], key_terms=terms[:40])
        total += bool(best)
json.dump(out, open(os.path.join(HERE, 'by_subtopic.json'), 'w'), ensure_ascii=False, indent=1)
print(f'{len(meta)} book sections indexed; {total}/{len(out)} subtopics linked to at least one section')
