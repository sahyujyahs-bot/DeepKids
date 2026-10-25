"""Find pictures we may publish in the founder's book PDFs, with their captions and credits.
Usage: python3 app/build/book_images.py <folder of PDFs> <output folder>
1. Reads the licence pages of every PDF and records the licence in app/content/books/free_books.json.
   Only public domain, CC0 and CC BY books are marked "publish". Share-alike, non-commercial, "all rights reserved"
   and books with no licence found are marked "reference": their pictures are never extracted.
   A person can correct an entry by hand; hand-set entries ("checked": true) are never overwritten.
2. For each "publish" book, extracts every picture at least 250 px on both sides into <output>/<book>/p<page>-<n>.<ext>
   and writes <output>/catalogue.json: [{book, file, page, img, caption, credit, w, h}].
   A figure whose caption credits someone else under "©", "all rights reserved" or "used with permission" is skipped.
Pictures are not added to units here; pick from the catalogue and copy the chosen ones into app/content/media/img/."""
import json, os, re, subprocess, sys, glob

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
REG = os.path.join(APP, 'content', 'books', 'free_books.json')
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True); os.makedirs(os.path.dirname(REG), exist_ok=True)
reg = json.load(open(REG)) if os.path.exists(REG) else {}


def text(f, a, b):
    return subprocess.run(['pdftotext', '-f', str(a), '-l', str(b), f, '-'], capture_output=True, text=True).stdout


def pages(f):
    m = re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', f], capture_output=True, text=True).stdout)
    return int(m.group(1)) if m else 0


def licence(f):
    n = pages(f); t = (text(f, 1, 10) + text(f, max(1, n - 3), n)).lower()
    if re.search(r'cc[ -]by[ -](nc|sa|nd)|noncommercial|non-commercial|sharealike|share alike|share-alike|noderivatives', t): return 'share-alike or non-commercial', 'reference'
    if re.search(r'creative commons attribution 4|cc by 4|cc by 3|creative commons attribution 3|cc by licen', t): return 'CC BY', 'publish'
    if re.search(r'cc0|public domain|project gutenberg', t): return 'public domain', 'publish'
    if 'all rights reserved' in t: return 'all rights reserved', 'reference'
    return 'not found', 'reference'


BAD = re.compile(r'©|all rights reserved|used with permission|courtesy of', re.I)
cat = []
for f in sorted(glob.glob(os.path.join(src, '*.pdf'))):
    name = os.path.basename(f)
    if not reg.get(name, {}).get('checked'):
        lic, use = licence(f); reg[name] = {'title': name[:-4], 'licence': lic, 'use': use}
    if reg[name]['use'] != 'publish': continue
    key = re.sub(r'[^a-z0-9]+', '-', name[:-4].lower()).strip('-')[:40]; d = os.path.join(out, key); os.makedirs(d, exist_ok=True)
    if not os.listdir(d): subprocess.run(['pdfimages', '-p', '-j', '-png', f, os.path.join(d, 'i')], capture_output=True)
    per = {}
    for p in sorted(os.listdir(d)):
        m = re.match(r'i-(\d+)-(\d+)\.', p)
        if not m: continue
        per.setdefault(int(m.group(1)), []).append(p)
    for pg, imgs in per.items():
        t = text(f, pg, pg)
        caps = [re.sub(r'\s+', ' ', c).strip() for c in re.findall(r'(?:^|\n)((?:Figure|Fig\.|FIG\.)\s*\d+[.\d]*\.?\s.*?)(?:\n\s*\n|$)', t, re.S)]
        ctx = re.sub(r'\s+', ' ', t).strip()[:300]
        for i, p in enumerate(imgs):
            fp = os.path.join(d, p); sz = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fp], capture_output=True, text=True).stdout.strip().split(',')
            try: w, h = int(sz[0]), int(sz[1])
            except Exception: continue
            if w < 250 or h < 250: os.remove(fp); continue
            cap = caps[i] if i < len(caps) else (caps[-1] if caps else '')
            cr = re.search(r'\(credit[^)]*\)', cap, re.I)
            if BAD.search(cap): continue
            cat.append({'book': reg[name]['title'], 'file': name, 'licence': reg[name]['licence'], 'page': pg, 'img': os.path.join(key, p), 'w': w, 'h': h,
                        'caption': cap[:400], 'page_text': '' if cap else ctx, 'credit': cr.group(0)[1:-1] if cr else ''})
json.dump(reg, open(REG, 'w'), indent=1, ensure_ascii=False)
json.dump(cat, open(os.path.join(out, 'catalogue.json'), 'w'), indent=1, ensure_ascii=False)
print(len(cat), 'pictures from', sum(1 for v in reg.values() if v['use'] == 'publish'), 'publishable books;', sum(1 for v in reg.values() if v['use'] != 'publish'), 'books kept for reference only')
