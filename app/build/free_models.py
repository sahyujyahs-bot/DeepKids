"""Find free 3D models on Sketchfab (CC BY or CC0 only) and add them to a unit's "Turn it around in 3D" card.

  python3 app/build/free_models.py search "human skeleton" [n] [sheet.jpg]
      prints up to n candidates (default 6): uid, name, licence, credit, likes; with sheet.jpg, also saves their
      thumbnails side by side, numbered 1..n, as one picture to look at
  python3 app/build/free_models.py add <unit id> <uid> "<title a child understands>" ["<one line: what to look for>"]
      records it in <unit id>.models.json with its credit, and saves its thumbnail to app/content/media/models/
The model itself stays on Sketchfab and opens in the unit only when tapped."""
import json, os, sys, urllib.parse, urllib.request
from io import BytesIO

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
UA = 'DeepKidsModels/1.0 (https://deepkids.in)'
LIC = {'by': 'CC BY 4.0', 'cc0': 'CC0'}
LABEL = {'CC Attribution': 'by', 'CC0 Public Domain': 'cc0'}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


def thumb(m, w=400):
    im = sorted(m.get('thumbnails', {}).get('images', []), key=lambda x: abs(x['width'] - w))
    return im[0]['url'] if im else None


def slug(m):
    L = m.get('license') or {}
    return L.get('slug') or LABEL.get(L.get('label'))


def row(m):
    lic = slug(m)
    return {'uid': m['uid'], 'name': m['name'], 'licence': LIC.get(lic, lic),
            'credit': f"“{m['name']}” by {m['user']['displayName']}, {LIC.get(lic, lic)}, via Sketchfab",
            'likes': m.get('likeCount'), 'thumb': thumb(m)}


def search(q, n=6):
    out = []
    for lic in ('by', 'cc0'):
        d = json.loads(get('https://api.sketchfab.com/v3/search?' + urllib.parse.urlencode(
            {'type': 'models', 'q': q, 'license': lic, 'sort_by': '-likeCount', 'count': 12})))
        out += [row(m) for m in d.get('results', []) if slug(m) in LIC]
    return sorted(out, key=lambda x: -(x['likes'] or 0))[:n]


def sheet(c, out):
    from PIL import Image, ImageDraw, ImageFont
    S, W = 300, 3
    im = Image.new('RGB', (W * S, ((len(c) + W - 1) // W) * S), 'white'); d = ImageDraw.Draw(im)
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 28)
    for i, x in enumerate(c):
        try:
            t = Image.open(BytesIO(get(x['thumb']))).convert('RGB'); t.thumbnail((S - 8, S - 8))
            im.paste(t, ((i % W) * S + (S - t.width) // 2, (i // W) * S + (S - t.height) // 2))
        except Exception:
            pass
        d.rectangle([(i % W) * S, (i // W) * S, (i % W) * S + 40, (i // W) * S + 36], fill='black')
        d.text(((i % W) * S + 8, (i // W) * S + 2), str(i + 1), fill='white', font=f)
    im.save(out, quality=80)


def main(a):
    if a[0] == 'search':
        c = search(a[1], int(a[2]) if len(a) > 2 else 6)
        if len(a) > 3 and c: sheet(c, a[3])
        for i, x in enumerate(c): x['n'] = i + 1; del x['thumb']
        print(json.dumps(c, indent=1, ensure_ascii=False))
    elif a[0] == 'add':
        uid_u, uid, title = a[1:4]
        m = json.loads(get('https://api.sketchfab.com/v3/models/' + uid))
        if slug(m) not in LIC: raise SystemExit('not CC BY or CC0: leave it')
        x = row(m)
        d = os.path.join(APP, 'content', 'media', 'models'); os.makedirs(d, exist_ok=True)
        from PIL import Image
        t = Image.open(BytesIO(get(thumb(m, 640)))).convert('RGB'); t.save(os.path.join(d, uid + '.jpg'), quality=80)
        f = os.path.join(APP, 'content', 'units', uid_u.split('.')[0], uid_u + '.models.json')
        L = [y for y in (json.load(open(f)) if os.path.exists(f) else []) if y['uid'] != uid]
        L.append({'uid': uid, 'title': title, **({'why': a[4]} if len(a) > 4 else {}), 'thumb': f'media/models/{uid}.jpg',
                  'credit': x['credit']})
        json.dump(L, open(f, 'w'), indent=1, ensure_ascii=False)
        print('ok', x['credit'])


main(sys.argv[1:])
