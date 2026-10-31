"""Find free pictures and put them in units, with their credit. Three sources:
  inat     iNaturalist: real photos of animals, plants, fungi and insects (photos taken in India first)
  nasa     NASA Images: the Sun, Moon, planets, Earth from space, rockets
  commons  Wikimedia Commons: objects, materials, places, diagrams (slow: Commons limits this machine)
Only public domain, CC0 and CC BY pictures are offered (never share-alike, non-commercial or no-derivatives).

  python3 app/build/free_images.py search <inat|nasa|commons> "bar magnet" [n] [sheet.jpg]
      prints up to n candidates (default 6): id, licence, credit; with sheet.jpg, also saves their
      thumbnails side by side, numbered 1..n, as one picture to look at. For inat, give the living thing's name
      ("house crow", "neem tree", "honey bee").
  python3 app/build/free_images.py slot <unit id> <key> <id from a search>
      a picture for a card in the unit player (key as in fxImg: term.0, expl.2, setup.e1.0, flow.e1, intro…),
      saved to app/content/media/img/<unit id>/<key>.jpg and recorded in <unit id>.art.json with its credit
  python3 app/build/free_images.py card <unit id> <game id> <printable no> <item no> <id from a search>
      a picture on a printed card's front, saved to app/content/media/cards/ and set as the item's img
      (a text item becomes {"f": text, "img": …})"""
import fcntl, json, os, re, subprocess, sys, time, urllib.parse, urllib.request

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'DeepKidsImages/1.0 (https://deepkids.in)'
OK = re.compile(r'^(public domain|pd\b|pd-|cc0|cc by \d|cc-by-\d|attribution$)', re.I)
BAD = re.compile(r'\b(sa|nc|nd)\b|share|noncommercial|no deriv', re.I)


CACHE = '/tmp/dk_pictures_found.json'   # what searches found, so slot and card can save a picture by its id
INAT = 'https://api.inaturalist.org/v1/'
ILIC = {'cc0': 'CC0', 'cc-by': 'CC BY'}


def fetch_url(url):
    """One request to Commons at a time from this machine, at least 2.5 s apart, waiting and retrying when it is busy."""
    if 'wikimedia.org' not in url:
        return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=90).read()
    for i in range(8):
        with open('/tmp/dk_commons.lock', 'a+') as lk:
            fcntl.flock(lk, fcntl.LOCK_EX)
            lk.seek(0); last = float(lk.read() or 0)
            time.sleep(max(0, last + 2.5 - time.time()))
            lk.seek(0); lk.truncate(); lk.write(str(time.time())); lk.flush()
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503): raise
            time.sleep(10 * (i + 1))
    raise SystemExit('Commons is busy, try again in a few minutes')


def get(params):
    return json.loads(fetch_url(API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})))


def strip(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h or '')).strip()


def info(titles, width=400):
    q = get({'action': 'query', 'titles': '|'.join(titles), 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata|mime',
             'iiurlwidth': width})
    out = []
    for p in q.get('query', {}).get('pages', {}).values():
        ii = (p.get('imageinfo') or [{}])[0]; m = ii.get('extmetadata', {})
        lic = strip(m.get('LicenseShortName', {}).get('value'))
        if not ii or not OK.search(lic) or BAD.search(lic) or ii.get('mime') not in ('image/jpeg', 'image/png'): continue
        who = strip(m.get('Artist', {}).get('value')) or 'Unknown'
        out.append({'id': p['title'], 'licence': lic, 'credit': f"{who[:80]}, {lic}, via Wikimedia Commons",
                    'desc': strip(m.get('ImageDescription', {}).get('value'))[:160], 'w': ii.get('width'),
                    'h': ii.get('height'), 'thumb': ii.get('thumburl'), 'big': ii.get('thumburl')})
    return out


def inat(q, n):
    t = json.loads(fetch_url(INAT + 'taxa?' + urllib.parse.urlencode({'q': q, 'per_page': 1}))).get('results')
    if not t: return []
    out, seen = [], set()
    for place in ({'place_id': 6681}, {}):   # India first, then anywhere
        o = json.loads(fetch_url(INAT + 'observations?' + urllib.parse.urlencode(
            {'taxon_id': t[0]['id'], 'photo_license': 'cc-by,cc0', 'quality_grade': 'research', 'order_by': 'votes',
             'per_page': 12, **place})))['results']
        for x in o:
            ph = next((p for p in x['photos'] if p.get('license_code') in ILIC), None)
            if not ph or ph['id'] in seen: continue
            seen.add(ph['id']); who = (x['user'].get('name') or x['user']['login'])[:60]; lic = ILIC[ph['license_code']]
            out.append({'id': f"inat:{ph['id']}", 'licence': lic, 'credit': f"{who}, {lic}, via iNaturalist",
                        'desc': f"{t[0].get('preferred_common_name') or ''} ({t[0]['name']}), {x.get('place_guess') or ''}"[:160],
                        'thumb': ph['url'].replace('/square.', '/small.'), 'big': ph['url'].replace('/square.', '/large.')})
        if len(out) >= n: break
    return out[:n]


def nasa(q, n):
    d = json.loads(fetch_url('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'q': q, 'media_type': 'image'})))
    out = []
    for i in d['collection']['items']:
        m = i['data'][0]; who = m.get('secondary_creator') or m.get('photographer') or 'NASA'
        if 'NASA' not in who and who != 'NASA': continue   # pictures by others, shown on NASA's site, may not be free
        L = [l['href'] for l in i.get('links', []) if l.get('href', '').endswith('.jpg')]
        if not L: continue
        out.append({'id': 'nasa:' + m['nasa_id'], 'licence': 'Public domain', 'credit': f"{who}, public domain",
                    'desc': (m.get('title', '') + ': ' + (m.get('description') or ''))[:160],
                    'thumb': next((x for x in L if '~small' in x or '~thumb' in x), L[0]),
                    'big': next((x for x in L if '~medium' in x), L[0])})
        if len(out) >= n: break
    return out


def commons(q, n=6):
    r = get({'action': 'query', 'list': 'search', 'srsearch': q + ' filetype:bitmap', 'srnamespace': 6, 'srlimit': 30})
    titles = [x['title'] for x in r.get('query', {}).get('search', [])]
    return [x for x in info(titles) if (x['w'] or 0) >= 300][:n] if titles else []


def sheet(cands, out):
    from io import BytesIO
    from PIL import Image, ImageDraw, ImageFont
    S = 300; W = 3; H = (len(cands) + W - 1) // W
    im = Image.new('RGB', (W * S, H * S), 'white'); d = ImageDraw.Draw(im)
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 28)
    for i, c in enumerate(cands):
        try:
            t = Image.open(BytesIO(fetch_url(c['thumb']))).convert('RGB'); t.thumbnail((S - 8, S - 8))
            im.paste(t, ((i % W) * S + (S - t.width) // 2, (i // W) * S + (S - t.height) // 2))
        except Exception:
            pass
        d.rectangle([(i % W) * S, (i // W) * S, (i % W) * S + 40, (i // W) * S + 36], fill='black')
        d.text(((i % W) * S + 8, (i // W) * S + 2), str(i + 1), fill='white', font=f)
    im.save(out, quality=80)


def fetch(pid, dst):
    if pid.startswith('File:'):
        x = (info([pid], 900) or [None])[0]
    else:
        x = (json.load(open(CACHE)) if os.path.exists(CACHE) else {}).get(pid)
    if not x: raise SystemExit(f'{pid}: not found (search for it first), or its licence is not public domain, CC0 or CC BY')
    tmp = dst + '.dl'
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    try:
        open(tmp, 'wb').write(fetch_url(x['big']))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-vf', 'scale=min(900\\,iw):-2', '-q:v', '5', dst], check=True)
    finally:
        if os.path.exists(tmp): os.remove(tmp)
    return x


def unit_file(uid):
    return os.path.join(APP, 'content', 'units', uid.split('.')[0], uid + '.json')


def main(a):
    if a[0] == 'search':
        c = {'inat': inat, 'nasa': nasa, 'commons': commons}[a[1]](a[2], int(a[3]) if len(a) > 3 else 6)
        with open(CACHE + '.lock', 'a') as lk:
            fcntl.flock(lk, fcntl.LOCK_EX)
            seen = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
            seen.update({x['id']: x for x in c}); json.dump(seen, open(CACHE, 'w'))
        if len(a) > 4 and c: sheet(c, a[4])
        for i, x in enumerate(c): x['n'] = i + 1; del x['thumb'], x['big']
        print(json.dumps(c, indent=1, ensure_ascii=False))
    elif a[0] == 'slot':
        uid, key, title = a[1:4]
        f = unit_file(uid)[:-5] + '.art.json'
        art = json.load(open(f)) if os.path.exists(f) else {}
        if key in art: raise SystemExit(f'{key} already has a picture; leave it')
        x = fetch(title, os.path.join(APP, 'content', 'media', 'img', uid, key + '.jpg'))
        art[key] = {'src': f'media/img/{uid}/{key}.jpg', 'credit': x['credit']}
        json.dump(dict(sorted(art.items())), open(f, 'w'), indent=1, ensure_ascii=False)
        print('ok', key, x['credit'])
    elif a[0] == 'card':
        uid, gid, pn, it, title = a[1], a[2], int(a[3]), int(a[4]), a[5]
        f = unit_file(uid); u = json.load(open(f))
        p = next(g for g in u['games'] if g['id'] == gid)['printables'][pn]
        name = f"{uid.split('.')[-2]}-{gid}-{pn}-{it:02d}.jpg"
        x = fetch(title, os.path.join(APP, 'content', 'media', 'cards', name))
        item = p['items'][it]
        item = item if isinstance(item, dict) else {'f': item}
        item['img'] = {'src': 'media/cards/' + name, 'credit': x['credit']}
        p['items'][it] = item
        json.dump(u, open(f, 'w'), indent=1, ensure_ascii=False)
        print('ok', name, x['credit'])


main(sys.argv[1:])
