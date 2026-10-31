"""Find free pictures on Wikimedia Commons and put them in units, with their credit.
Only public domain, CC0 and CC BY pictures are offered (never share-alike, non-commercial or no-derivatives).

  python3 app/build/free_images.py search "bar magnet" [n] [sheet.jpg]
      prints up to n candidates (default 6): file, licence, credit, size; with sheet.jpg, also saves their
      thumbnails side by side, numbered 1..n, as one picture to look at
  python3 app/build/free_images.py slot <unit id> <key> "File:Name.jpg"
      a picture for a card in the unit player (key as in fxImg: term.0, expl.2, setup.e1.0, flow.e1, intro…),
      saved to app/content/media/img/<unit id>/<key>.jpg and recorded in <unit id>.art.json with its credit
  python3 app/build/free_images.py card <unit id> <game id> <printable no> <item no> "File:Name.jpg"
      a picture on a printed card's front, saved to app/content/media/cards/ and set as the item's img
      (a text item becomes {"f": text, "img": …})"""
import fcntl, json, os, re, subprocess, sys, time, urllib.parse, urllib.request

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'DeepKidsImages/1.0 (https://deepkids.in)'
OK = re.compile(r'^(public domain|pd\b|pd-|cc0|cc by \d|cc-by-\d|attribution$)', re.I)
BAD = re.compile(r'\b(sa|nc|nd)\b|share|noncommercial|no deriv', re.I)


def fetch_url(url):
    """One request to Commons at a time from this machine, at least 2.5 s apart, waiting and retrying when it is busy."""
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
        out.append({'file': p['title'], 'licence': lic, 'credit': f"{who[:80]}, {lic}, via Wikimedia Commons",
                    'desc': strip(m.get('ImageDescription', {}).get('value'))[:160], 'w': ii.get('width'),
                    'h': ii.get('height'), 'thumb': ii.get('thumburl'), 'page': ii.get('descriptionurl')})
    return out


def search(q, n=6):
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


def fetch(title, dst):
    x = info([title], 900)
    if not x: raise SystemExit(f'{title}: not found, or its licence is not public domain, CC0 or CC BY')
    tmp = dst + '.dl'
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(tmp, 'wb').write(fetch_url(x[0]['thumb']))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-vf', 'scale=min(900\\,iw):-2', '-q:v', '5', dst], check=True)
    os.remove(tmp)
    return x[0]


def unit_file(uid):
    return os.path.join(APP, 'content', 'units', uid.split('.')[0], uid + '.json')


def main(a):
    if a[0] == 'search':
        c = search(a[1], int(a[2]) if len(a) > 2 else 6)
        if len(a) > 3 and c: sheet(c, a[3])
        for i, x in enumerate(c): x['n'] = i + 1; del x['thumb']
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
