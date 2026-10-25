"""Open textbooks knowledge base: fetch open-licensed maths and science books from GitHub and extract them.

  python3 knowledge/fetch_and_extract.py            # clone (text only) into knowledge/.cache/src and extract
Writes:
  knowledge/catalog.json                 every book: title, authors, licence, what we may do with it
  knowledge/index/<book>.json            chapters and sections: titles, learning objectives, key terms (committed)
  knowledge/.cache/text/<book>.jsonl     full section text and glossary (NOT committed unless the licence
                                         allows commercial reuse; see USE below). Re-run this script to rebuild.
Only github.com is reachable from the build environment, so the books are the ones whose source lives there.
"""
import json, os, re, subprocess, glob, gzip
import xml.etree.ElementTree as ET
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, '.cache'); SRC = os.path.join(CACHE, 'src'); TXT = os.path.join(CACHE, 'text'); IDX = os.path.join(HERE, 'index'); FREE = os.path.join(HERE, 'text')
for d in (SRC, TXT, IDX, FREE): os.makedirs(d, exist_ok=True)

# repo, kind, licence, subject
REPOS = [
 ("openstax/osbooks-physics", "openstax", "sci"), ("openstax/osbooks-statistics", "openstax", "math"),
 ("openstax/osbooks-biology-bundle", "openstax", "sci"), ("openstax/osbooks-microbiology", "openstax", "sci"),
 ("openstax/osbooks-anatomy-physiology", "openstax", "sci"), ("openstax/osbooks-chemistry-bundle", "openstax", "sci"),
 ("openstax/osbooks-organic-chemistry", "openstax", "sci"), ("openstax/osbooks-university-physics-bundle", "openstax", "sci"),
 ("openstax/osbooks-college-physics-bundle", "openstax", "sci"), ("openstax/osbooks-astronomy", "openstax", "sci"),
 ("openstax/osbooks-psychology", "openstax", "sci"), ("openstax/osbooks-prealgebra-bundle", "openstax", "math"),
 ("openstax/osbooks-college-algebra-bundle", "openstax", "math"), ("openstax/osbooks-calculus-bundle", "openstax", "math"),
 ("openstax/osbooks-introductory-statistics-bundle", "openstax", "math"), ("openstax/osbooks-contemporary-mathematics", "openstax", "math"),
 ("openstax/osbooks-introduction-philosophy", "openstax", "phil"), ("openstax/osbooks-world-history", "openstax", "hist"),
 ("OpenLogicProject/OpenLogic", "latex", "math"), ("OpenIntroStat/openintro-statistics", "latex", "math"),
 ("APEXCalculus/APEXCalculus_Source", "latex", "math"), ("mitchkeller/applied-combinatorics", "pretext", "math"),
 ("twjudson/aata", "pretext", "math"), ("rbeezer/fcla", "pretext", "math"), ("oscarlevin/discrete-book", "pretext", "math"),
 ("OpenIntroStat/ims", "quarto", "math"), ("uccser/cs-unplugged", "unplugged", "math"),
 ("CompCogNeuro/ed4", "markdown", "sci"), ("holdenlee/number-theory", "latex", "math"),
]
# licence -> may we put the text itself into DeepKids lessons (a paid product)?
USE = {"CC BY 4.0": "reuse", "CC BY-SA": "share-alike", "GFDL": "share-alike", "CC BY-NC-SA 4.0": "reference", "CC BY-NC": "reference", "CC BY-NC-SA": "reference"}
FIXED_LICENCE = {"OpenLogicProject/OpenLogic": "CC BY 4.0", "OpenIntroStat/openintro-statistics": "CC BY-SA", "OpenIntroStat/ims": "CC BY-SA",
                 "mitchkeller/applied-combinatorics": "CC BY-SA", "twjudson/aata": "GFDL", "rbeezer/fcla": "GFDL",
                 "oscarlevin/discrete-book": "CC BY-NC-SA", "APEXCalculus/APEXCalculus_Source": "CC BY-NC", "uccser/cs-unplugged": "CC BY-SA", "CompCogNeuro/ed4": "CC BY 4.0", "holdenlee/number-theory": "no licence"}
USE["no licence"] = "reference"
NOTE = {"reuse": "Text may be adapted into DeepKids lessons with credit.",
        "share-alike": "Text may be adapted only if the adapted lesson is shared under the same licence; use for ideas and facts, write our own words.",
        "reference": "Non-commercial licence: use for research, facts and ideas only; never copy text into DeepKids (a paid product)."}

def clone(repo, kind):
    d = os.path.join(SRC, repo.split('/')[1])
    if os.path.isdir(os.path.join(d, '.git')): return d
    env = dict(os.environ, GIT_LFS_SKIP_SMUDGE='1')
    if kind == 'openstax':
        subprocess.run(['git', 'clone', '-q', '--depth', '1', '--filter=blob:none', '--sparse', f'https://github.com/{repo}', d], check=True, env=env)
        subprocess.run(['git', '-C', d, 'sparse-checkout', 'set', '--no-cone', '/collections/*', '/modules/*/index.cnxml'], check=True, env=env, capture_output=True)
    else:
        subprocess.run(['git', 'clone', '-q', '--depth', '1', '--filter=blob:limit=2m', f'https://github.com/{repo}', d], check=True, env=env)
    return d

sp = lambda s: re.sub(r'\s+', ' ', s or '').strip()
NS = {'c': 'http://cnx.rice.edu/cnxml', 'col': 'http://cnx.rice.edu/collxml', 'md': 'http://cnx.rice.edu/mdml'}
def txt(e):
    """text of an element, skipping MathML annotations and teacher notes"""
    out = []
    def walk(x):
        tag = x.tag.split('}')[-1]
        if tag in ('annotation', 'annotation-xml') or (tag == 'note' and 'os-teacher' in (x.get('class') or '')): return
        if x.text: out.append(x.text)
        for ch in x: walk(ch); out.append(ch.tail or '')
    walk(e); return sp(''.join(out))

def openstax(d):
    books = []
    for cf in sorted(glob.glob(os.path.join(d, 'collections', '*.xml'))):
        root = ET.parse(cf).getroot(); md = root.find('col:metadata', NS) if root.find('col:metadata', NS) is not None else root.find('{http://cnx.rice.edu/collxml}metadata')
        title = sp(root.find('.//md:title', NS).text); lic = root.find('.//md:license', NS).get('url', '')
        licence = 'CC BY 4.0' if '/by/' in lic else 'CC BY-NC-SA 4.0' if 'by-nc-sa' in lic else lic
        secs = []
        def walk(node, chap, cno):
            for ch in node:
                tag = ch.tag.split('}')[-1]
                if tag == 'subcollection':
                    t = sp(ch.find('md:title', NS).text); c = ch.find('col:content', NS)
                    if c is not None: walk(c, t if chap is None else chap, (len([1 for s in secs if s['chapter']]) and cno) or cno)
                elif tag == 'module':
                    mf = os.path.join(d, 'modules', ch.get('document'), 'index.cnxml')
                    if not os.path.exists(mf): continue
                    m = ET.parse(mf).getroot(); content = m.find('c:content', NS)
                    obj = [txt(i) for n in m.iter('{http://cnx.rice.edu/cnxml}note') if 'learning-objectives' in (n.get('class') or '') for i in n.iter('{http://cnx.rice.edu/cnxml}item')]
                    terms = sorted({txt(t) for t in m.iter('{http://cnx.rice.edu/cnxml}term') if txt(t) and len(txt(t)) < 60})
                    gl = [(txt(df.find('c:term', NS)), txt(df.find('c:meaning', NS))) for df in m.iter('{http://cnx.rice.edu/cnxml}definition') if df.find('c:term', NS) is not None and df.find('c:meaning', NS) is not None]
                    paras = [txt(p) for p in (content.iter('{http://cnx.rice.edu/cnxml}para') if content is not None else []) ]
                    nex = sum(1 for _ in m.iter('{http://cnx.rice.edu/cnxml}exercise'))
                    secs.append(dict(chapter=chap or '', section=sp(m.find('c:title', NS).text), module=ch.get('document'), objectives=[o for o in obj if o],
                                     key_terms=terms[:60], glossary=gl, exercises=nex, text='\n'.join(p for p in paras if p)))
        walk(root.find('col:content', NS), None, 0)
        books.append(dict(title=title, licence=licence, sections=secs, slug=os.path.basename(cf).replace('.collection.xml', '')))
    return books

TEXCMD = re.compile(r'\\(?:begin|end)\{[^}]*\}|\\[a-zA-Z@]+\*?(?:\[[^\]]*\])?|[{}$~]|%.*')
def latex_clean(s): return sp(TEXCMD.sub(' ', s))
def latex(d, title):
    secs, chap = [], ''
    files = sorted(glob.glob(os.path.join(d, '**', '*.tex'), recursive=True))
    for f in files:
        try: s = open(f, errors='ignore').read()
        except Exception: continue
        for part in re.split(r'(\\(?:chapter|section)\*?\{[^}]*\})', s):
            m = re.match(r'\\(chapter|section)\*?\{([^}]*)\}', part)
            if m:
                if m.group(1) == 'chapter': chap = latex_clean(m.group(2))
                else: secs.append(dict(chapter=chap, section=latex_clean(m.group(2)), objectives=[], key_terms=[], glossary=[], exercises=0, text=''))
            elif secs and part.strip():
                secs[-1]['text'] += ' ' + latex_clean(part)[:20000]
                secs[-1]['key_terms'] = sorted(set(secs[-1]['key_terms']) | {latex_clean(t) for t in re.findall(r'\\(?:emph|textbf|index|term|defn)\{([^}]{2,40})\}', part)})[:60]
    return [dict(title=title, sections=[s for s in secs if len(s['text']) > 200])]

def pretext(d, title):
    secs = []
    for f in sorted(glob.glob(os.path.join(d, '**', '*.ptx'), recursive=True) + glob.glob(os.path.join(d, 'src', '**', '*.xml'), recursive=True)):
        try: root = ET.parse(f).getroot()
        except Exception: continue
        chap = ''
        for el in root.iter():
            tag = el.tag.split('}')[-1]
            if tag == 'chapter' and el.find('title') is not None: chap = txt(el.find('title'))
            if tag in ('section', 'subsection') and el.find('title') is not None:
                terms = sorted({txt(t) for t in el.iter('term') if txt(t)})[:60]
                defs = [(txt(x.find('title')) if x.find('title') is not None else '', txt(x.find('statement')) if x.find('statement') is not None else '') for x in el.iter('definition')]
                secs.append(dict(chapter=chap, section=txt(el.find('title')), objectives=[], key_terms=terms, glossary=[g for g in defs if g[0] and g[1]], exercises=sum(1 for _ in el.iter('exercise')),
                                 text=' '.join(txt(p) for p in el.findall('.//p'))[:30000]))
    return [dict(title=title, sections=[s for s in secs if len(s['text']) > 200])]

def quarto(d, title):
    secs = []
    for f in sorted(glob.glob(os.path.join(d, '*.qmd'))):
        s = open(f, errors='ignore').read(); chap = ''
        for part in re.split(r'(?m)^(#{1,2} .+)$', s):
            if part.startswith('# '): chap = sp(re.sub(r'\{.*\}', '', part[2:]))
            elif part.startswith('## '): secs.append(dict(chapter=chap, section=sp(re.sub(r'\{.*\}', '', part[3:])), objectives=[], key_terms=[], glossary=[], exercises=0, text=''))
            elif secs: secs[-1]['text'] += sp(re.sub(r'```.*?```|<[^>]+>|\[\^?[^\]]*\]\([^)]*\)|[*_`#>]', ' ', part, flags=re.S))[:20000]
    return [dict(title=title, sections=[s for s in secs if len(s['text']) > 200])]

def markdown(d, title):
    secs = []
    for f in sorted(glob.glob(os.path.join(d, 'chapter-*.md'))):
        s = open(f, errors='ignore').read(); chap = ''
        for part in re.split(r'(?m)^(#{1,2} .+)$', s):
            if part.startswith('# '): chap = sp(re.sub(r'\{.*\}', '', part[2:]))
            elif part.startswith('## '): secs.append(dict(chapter=chap, section=sp(re.sub(r'\{.*\}', '', part[3:])), objectives=[], key_terms=[], glossary=[], exercises=0, text=''))
            elif secs: secs[-1]['text'] += sp(re.sub(r'```.*?```|<[^>]+>|\[\^?[^\]]*\]\([^)]*\)|[*_`#>]', ' ', part, flags=re.S))[:20000]
    return [dict(title=title, sections=[s for s in secs if len(s['text']) > 200])]

def unplugged(d, title):
    secs = []
    base = os.path.join(d, 'csunplugged', 'topics', 'content', 'en')
    for f in sorted(glob.glob(os.path.join(base, '**', '*.md'), recursive=True)):
        rel = os.path.relpath(f, base).split(os.sep); s = open(f, errors='ignore').read()
        m = re.search(r'(?m)^# (.+)$', s)
        secs.append(dict(chapter=rel[0].replace('-', ' ').title(), section=sp(m.group(1)) if m else rel[-1][:-3].replace('-', ' '), objectives=[], key_terms=[], glossary=[], exercises=0,
                         text=sp(re.sub(r'\{[^}]*\}|<[^>]+>|[*_`#>]', ' ', s))[:15000]))
    return [dict(title=title, sections=[s for s in secs if len(s['text']) > 150])]

TITLES = {"OpenLogicProject/OpenLogic": "The Open Logic Text", "OpenIntroStat/openintro-statistics": "OpenIntro Statistics",
          "APEXCalculus/APEXCalculus_Source": "APEX Calculus", "mitchkeller/applied-combinatorics": "Applied Combinatorics (Keller & Trotter)",
          "twjudson/aata": "Abstract Algebra: Theory and Applications (Judson)", "rbeezer/fcla": "A First Course in Linear Algebra (Beezer)",
          "oscarlevin/discrete-book": "Discrete Mathematics: An Open Introduction (Levin)", "OpenIntroStat/ims": "Introduction to Modern Statistics (OpenIntro)",
          "uccser/cs-unplugged": "CS Unplugged (computer science without computers, ages 5-14)",
          "CompCogNeuro/ed4": "Computational Cognitive Neuroscience (O'Reilly et al.)", "holdenlee/number-theory": "Number Theory (open draft, Holden Lee)"}
cat = []
for repo, kind, subj in REPOS:
    d = clone(repo, kind)
    books = openstax(d) if kind == 'openstax' else {'latex': latex, 'pretext': pretext, 'quarto': quarto, 'unplugged': unplugged, 'markdown': markdown}[kind](d, TITLES[repo])
    for b in books:
        lic = b.get('licence') or FIXED_LICENCE[repo]; use = USE.get(lic, 'reference')
        slug = b.get('slug') or repo.split('/')[1].lower()
        S = b['sections']
        cat.append(dict(slug=slug, title=b['title'], repo=f'https://github.com/{repo}', subject=subj, licence=lic, use=use, note=NOTE[use],
                        sections=len(S), words=sum(len(s['text'].split()) for s in S), glossary_terms=sum(len(s['glossary']) for s in S)))
        json.dump(dict(slug=slug, title=b['title'], licence=lic, use=use, sections=[dict(chapter=s['chapter'], section=s['section'], objectives=s['objectives'], key_terms=s['key_terms'], exercises=s['exercises']) for s in S]),
                  open(os.path.join(IDX, f'{slug}.json'), 'w'), ensure_ascii=False, indent=0)
        with open(os.path.join(TXT, f'{slug}.jsonl'), 'w') as f:
            for i, s in enumerate(S): f.write(json.dumps(dict(id=f'{slug}#{i}', **s), ensure_ascii=False) + '\n')
        if use == 'reuse':
            with gzip.open(os.path.join(FREE, f'{slug}.jsonl.gz'), 'wt') as f:
                for i, s in enumerate(S): f.write(json.dumps(dict(id=f'{slug}#{i}', **s), ensure_ascii=False) + '\n')
        print(f"{slug:45s} {lic:16s} {use:12s} {len(S):4d} sections {cat[-1]['words']:>8,} words {cat[-1]['glossary_terms']:>5} glossary")
json.dump(cat, open(os.path.join(HERE, 'catalog.json'), 'w'), ensure_ascii=False, indent=1)
print('books:', len(cat), 'sections:', sum(c['sections'] for c in cat), 'words:', f"{sum(c['words'] for c in cat):,}")
