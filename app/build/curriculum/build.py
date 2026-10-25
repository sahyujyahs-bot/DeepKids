"""Build the DeepKids Combined curriculum map for Science and Maths, Classes 1-5.

Two fundamental units:
  subtopic-level   e.g. sci.forces.friction.L3   (DeepKids Combined)
  syllabus-class-chapter   e.g. NCERT Class 3 Ch 4, Cambridge Stage 3 topic 6.5   (board tracks)
Each subtopic-level gets: its topic-level, class, syllabus chapters, prerequisites, go-deep and go-wide
subtopic-levels, and (science) the maths subtopic-levels and chapters it uses.

Run: python3 app/build/curriculum/build.py
Writes app/content/curriculum/{sci,math}.json and app/DeepKids_Curriculum_Science_Maths_L1-5.xlsx
"""
import json, os, re, sys
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE); APP = os.path.dirname(BUILD)
sys.path.insert(0, HERE)
from sci_map import TOPICS as SCI
from math_map import TOPICS as MATH, CAM_STRAND

# ---------- board chapters ----------
CH = {}   # key -> {board, cls, ref, title, covers, item}
wb = openpyxl.load_workbook(os.path.join(APP, 'DeepKids_Science_Board_Topics_L1-5.xlsx'), read_only=True)
for r in list(wb['All topics'].iter_rows(values_only=True))[1:]:
    if r[8] != 'From the book' or not r[5]: continue
    if r[3] == 'NCERT / CBSE':
        n = r[5].split('Ch ')[-1]; CH[f'N{r[0]}-{n}'] = dict(board='NCERT', cls=r[0], ref=f'Class {r[0]} Ch {n}', title=r[6], covers=r[7] or '', item=f'ncert|sci|{r[0]}|{n}')
    elif r[3] == 'Cambridge Primary':
        t = r[5].split(' · ')[-1]; u = t.split('.')[0]
        CH[f'C{r[0]}-{t}'] = dict(board='Cambridge', cls=r[0], ref=f'Stage {r[0]} {t}', title=r[6], covers=r[5].split(' · ')[0], item=f'cam|sci|{r[0]}|{u}')
    else:
        n = r[5].replace('Lesson ', ''); lvl = 'A' if r[0] == 3 else 'B'
        CH[f'O{r[0]}-{n}'] = dict(board='NIOS', cls=r[0], ref=f'Level {lvl} Lesson {n}', title=r[6], covers=r[7] or '', item=f'nios|sci|{r[0]}|{n}')
SCI_KEYS = set(CH)
wb = openpyxl.load_workbook(os.path.join(APP, 'DeepKids_Board_Topics_Collated.xlsx'), read_only=True)
MATH_KEYS = set()
for r in list(wb['All boards'].iter_rows(values_only=True))[1:]:
    if r[0] == 'NCERT / CBSE' and r[1] == 'Maths':
        k = f'M:N{r[3]}-{r[7]}'; CH[k] = dict(board='NCERT', cls=int(r[3]), ref=f'Class {r[3]} Ch {r[7]}', title=r[8], covers=r[6] or '', item=f'ncert|math|{r[3]}|{r[7]}'); MATH_KEYS.add(k)
CAMN = {"Nc": "Counting and sequences", "Ni": "Integers and powers (calculation)", "Nm": "Money", "Np": "Place value, ordering and rounding",
        "Nf": "Fractions, decimals, percentages, ratio", "Gt": "Time", "Gg": "Geometrical reasoning, shapes and measurements",
        "Gp": "Position and transformation", "Ss": "Statistics", "Sp": "Probability", "TWM": "Thinking and working mathematically"}
for st in range(1, 6):
    for c, nm in CAMN.items():
        k = f'M:C{st}-{c}'; CH[k] = dict(board='Cambridge', cls=st, ref=f'Stage {st} {c}', title=nm, covers='Cambridge Primary Maths 0096 framework', item=f'cam|math|{st}|{CAM_STRAND[c]}')
        MATH_KEYS.add(k)

# ---------- subtopic-levels ----------
def flatten(subj, topics):
    T, S = {}, {}
    for tid, tname, strand, subs in topics:
        T[tid] = dict(id=tid, name=tname, strand=strand, subs=[s[0] for s in subs])
        for sid, sname, levels, chaps, links in subs:
            S[f'{tid}/{sid}'] = dict(topic=tid, sid=sid, name=sname, levels=levels, chaps=chaps, links=links)
    return T, S
ST, SS = flatten('sci', SCI); MT, MS = flatten('math', MATH)
problems = []
def lv(S, ref, n, mode):
    """the level of subtopic ref to link from level n: 'pre' highest <= n, 'deep' lowest >= n, 'near' closest"""
    if ref not in S: problems.append(f'unknown subtopic {ref}'); return None
    L = sorted(S[ref]['levels'])
    if mode == 'pre': c = [l for l in L if l <= n]; return c[-1] if c else None
    if mode == 'deep': c = [l for l in L if l >= n]; return c[0] if c else L[-1]
    return min(L, key=lambda l: (abs(l - n), -l))
pre_ = lambda subj: 'M:' if subj == 'math' else ''
sid_of = lambda subj, ref, l: f'{subj}.{ref.replace("/", ".")}.L{l}'

def build(subj, T, S, keys):
    out, placed = [], {}
    for ref, s in S.items():
        L = sorted(s['levels'])
        for i, n in enumerate(L):
            chaps, verify = [], []
            for k in s['chaps']:
                q = k.endswith('?'); k = pre_(subj) + k.rstrip('?')
                if k not in CH: problems.append(f'{subj} {ref}: unknown chapter {k}'); continue
                if CH[k]['cls'] == n:
                    chaps.append(k); placed.setdefault(k, []).append(sid_of(subj, ref, n))
                    if q: verify.append(k)
            pre = [sid_of(subj, ref, L[i - 1])] if i else []
            for p in s['links'].get('pre', []):
                m = lv(S, p, n, 'pre')
                if m is None and p in S: problems.append(f'{subj} {ref} L{n}: prerequisite {p} is only taught at L{min(S[p]["levels"])}')
                elif m: pre.append(sid_of(subj, p, m))
            deep = [sid_of(subj, ref, L[i + 1])] if i + 1 < len(L) else []
            deep += [sid_of(subj, d, m) for d in s['links'].get('deep', []) if (m := lv(S, d, n, 'deep'))]
            wide = [sid_of(subj, f'{s["topic"]}/{o}', n) for o in T[s['topic']]['subs'] if o != s['sid'] and n in S[f'{s["topic"]}/{o}']['levels']]
            wide += [sid_of(subj, w, m) for w in s['links'].get('wide', []) if (m := lv(S, w, n, 'near'))]
            maths = []
            for m_ in s['links'].get('math', []):
                ml = lv(MS, m_, n, 'pre') or lv(MS, m_, n, 'deep')
                if ml: maths.append(dict(id=sid_of('math', m_, ml), chapters=['M:' + k.rstrip('?') for k in MS[m_]['chaps'] if CH.get('M:' + k.rstrip('?'), {}).get('cls') == ml]))
            out.append(dict(id=sid_of(subj, ref, n), subject=subj, topic=s['topic'], topic_name=T[s['topic']]['name'], strand=T[s['topic']]['strand'],
                            topic_level=f'{subj}.{s["topic"]}.L{n}', subtopic=s['sid'], name=s['name'], level=n, classes=[n],
                            covers=s['levels'][n], chapters=chaps, verify=verify, prerequisites=pre, go_deep=deep, go_wide=wide, maths=maths,
                            source=s['links'].get('src') or ('boards' if s['chaps'] else 'dk')))
        # chapters whose class matches no level of this subtopic
        for k in s['chaps']:
            k = pre_(subj) + k.rstrip('?')
            if k in CH and CH[k]['cls'] not in s['levels']: problems.append(f'{subj} {ref}: chapter {k} is Class {CH[k]["cls"]} but the subtopic has no L{CH[k]["cls"]}')
    missing = sorted(keys - set(placed))
    for k in missing: problems.append(f'{subj}: board chapter not mapped: {k} {CH[k]["ref"]} {CH[k]["title"]}')
    tl = {}
    for x in out:
        t = tl.setdefault(x['topic_level'], dict(id=x['topic_level'], subject=subj, topic=x['topic'], name=x['topic_name'], strand=x['strand'], level=x['level'], classes=[x['level']], subtopic_levels=[], chapters=[]))
        t['subtopic_levels'].append(x['id']); t['chapters'] += [c for c in x['chapters'] if c not in t['chapters']]
    return out, sorted(tl.values(), key=lambda t: (t['level'], t['topic'])), placed

sci, sci_tl, sci_placed = build('sci', ST, SS, SCI_KEYS)
math, math_tl, math_placed = build('math', MT, MS, MATH_KEYS)
used_in = {}
for x in sci:
    for m in x['maths']: used_in.setdefault(m['id'], []).append(x['id'])
for x in math: x['used_in_science'] = used_in.get(x['id'], [])
for x in sci + math: x['chapter_refs'] = [f"{CH[k]['board']} {CH[k]['ref']} {CH[k]['title']}" for k in x['chapters']]

OUT = os.path.join(APP, 'content', 'curriculum'); os.makedirs(OUT, exist_ok=True)
plain = lambda k: k[2:] if k.startswith('M:') else k
def clean(o):
    if isinstance(o, dict): return {plain(a) if isinstance(a, str) else a: clean(v) for a, v in o.items()}
    if isinstance(o, list): return [clean(v) for v in o]
    return plain(o) if isinstance(o, str) else o
for subj, sl, tl, placed in (('sci', sci, sci_tl, sci_placed), ('math', math, math_tl, math_placed)):
    json.dump(clean(dict(subject=subj, topic_levels=tl, subtopic_levels=sl,
                   chapters={k: dict(CH[k], subtopic_levels=placed.get(k, [])) for k in sorted(SCI_KEYS if subj == 'sci' else MATH_KEYS)})),
              open(os.path.join(OUT, f'{subj}.json'), 'w'), ensure_ascii=False, indent=1)

# ---------- review spreadsheet ----------
X = openpyxl.Workbook(); H = Font(bold=True, color='FFFFFF'); HF = PatternFill('solid', fgColor='2B2340'); W = Alignment(wrap_text=True, vertical='top')
NAME = {x['id']: f"{x['name']} L{x['level']}" for x in sci + math}
nm = lambda ids: '\n'.join(NAME.get(i, i) for i in ids)
def sheet(title, head, rows, widths):
    ws = X.create_sheet(title); ws.append(head)
    for c in ws[1]: c.font = H; c.fill = HF; c.alignment = W
    for r in rows: ws.append(r)
    for i, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row: c.alignment = W
    ws.freeze_panes = 'C2'; ws.auto_filter.ref = ws.dimensions
X.remove(X.active)
readme = X.create_sheet('Read me')
for line in ["DeepKids Combined curriculum map: Science and Maths, Classes 1-5 (draft for review)", "",
             "Two units: SUBTOPIC-LEVEL (DeepKids Combined; e.g. Friction L3) and SYLLABUS-CLASS-CHAPTER (board tracks; e.g. Cambridge Stage 3 topic 6.5).",
             "Level n is taught in Class n. A topic-level (e.g. Forces and movement L3) groups the subtopic-levels of that topic at that level.",
             "Each subtopic-level lists: what it covers, the board chapters it covers, prerequisites, go-deep and go-wide subtopic-levels, and (science) the maths it uses.",
             "Source: 'boards' = taught by NCERT/Cambridge/NIOS; 'notes' = from the founder's sheets (HomeSchooling Track, Grade Concepts); 'dk' = DeepKids addition.",
             "Chapters marked in the Verify column: NCERT Maths (new Joyful/Maths Mela books) chapter contents were mapped from titles and the books' sequence; check against the books.",
             "Cambridge Maths is mapped by framework sub-strand per stage (Nc, Ni, Np, Nf, Nm, Gt, Gg, Gp, Ss, Sp, TWM). NIOS Maths lessons are not listed yet.",
             "", f"Science: {len(ST)} topics, {len(SS)} subtopics, {len(sci)} subtopic-levels, {len(sci_tl)} topic-levels; board chapters mapped {len(sci_placed)}/{len(SCI_KEYS)}.",
             f"Maths: {len(MT)} topics, {len(MS)} subtopics, {len(math)} subtopic-levels, {len(math_tl)} topic-levels; board chapters mapped {len(math_placed)}/{len(MATH_KEYS)}.",
             f"Maths links in science: {sum(len(x['maths']) for x in sci)}.", f"Open checks: {len(problems)} (see the Checks sheet)."]:
    readme.append([line])
readme.column_dimensions['A'].width = 140
for subj, sl, tl, label in (('sci', sci, sci_tl, 'Science'), ('math', math, math_tl, 'Maths')):
    sheet(f'{label} topic-levels', ['Topic-level', 'Strand', 'Class', 'Subtopic-levels', 'Board chapters'],
          [[f"{t['name']} L{t['level']}", t['strand'], t['level'], nm(t['subtopic_levels']), '\n'.join(f"{CH[k]['board']} {CH[k]['ref']} {CH[k]['title']}" for k in t['chapters'])] for t in tl],
          [34, 16, 7, 50, 60])
    sheet(f'{label} subtopic-levels', ['Subtopic-level', 'Topic-level', 'Strand', 'Class', 'What this level covers', 'Board chapters', 'Verify', 'Prerequisites', 'Go deep', 'Go wide'] + (['Maths it uses'] if subj == 'sci' else ['Used in science']) + ['Source', 'ID'],
          [[f"{x['name']} L{x['level']}", f"{x['topic_name']} L{x['level']}", x['strand'], x['level'], x['covers'], '\n'.join(x['chapter_refs']), ', '.join(map(plain, x['verify'])),
            nm(x['prerequisites']), nm(x['go_deep']), nm(x['go_wide']),
            ('\n'.join(f"{NAME.get(m['id'], m['id'])}" + (f" ({', '.join(CH[c]['board'] + ' ' + CH[c]['ref'] for c in m['chapters'])})" if m['chapters'] else '') for m in x['maths']) if subj == 'sci' else nm(x['used_in_science'])),
            x['source'], x['id']] for x in sorted(sl, key=lambda x: (x['level'], x['strand'], x['topic'], x['subtopic']))],
          [30, 28, 14, 6, 60, 46, 10, 34, 34, 34, 40, 8, 30])
sheet('Board chapters', ['Board', 'Subject', 'Class', 'Chapter', 'Title', 'What it covers', 'Mapped to subtopic-levels'],
      [[CH[k]['board'], s, CH[k]['cls'], CH[k]['ref'], CH[k]['title'], CH[k]['covers'], nm(p.get(k, []))]
       for s, ks, p in (('Science', SCI_KEYS, sci_placed), ('Maths', MATH_KEYS, math_placed)) for k in sorted(ks, key=lambda k: (CH[k]['board'], CH[k]['cls'], k))],
      [11, 9, 6, 22, 34, 50, 50])
sheet('Checks', ['Open check'], [[p] for p in problems] or [['None']], [140])
XL = os.path.join(APP, 'DeepKids_Curriculum_Science_Maths_L1-5.xlsx'); X.save(XL)
print(f"science: {len(ST)} topics, {len(SS)} subtopics, {len(sci)} subtopic-levels, chapters mapped {len(sci_placed)}/{len(SCI_KEYS)}")
print(f"maths: {len(MT)} topics, {len(MS)} subtopics, {len(math)} subtopic-levels, chapters mapped {len(math_placed)}/{len(MATH_KEYS)}")
print(f"maths links in science: {sum(len(x['maths']) for x in sci)}; checks: {len(problems)}")
for p in problems: print('  ', p)
