"""Add generated pictures to units and host them on the website.
Usage: python3 app/build/add_art.py <urls.json>   ({"<unit id>|<image key>": "https://..."})
Downloads each picture, resizes it to at most 800 px wide as WebP into app/content/media/img/<unit id>/<key>.webp,
and records media/img/... in app/content/units/<subj>/<unit id>.art.json."""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import picture
APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
U = json.load(open(sys.argv[1])); by = {}
for k, url in U.items(): uid, key = k.split('|', 1); by.setdefault(uid, {})[key] = url
tmp = '/tmp/dk_art_dl'; n = 0
for uid, imgs in by.items():
    f = os.path.join(APP, 'content', 'units', uid.split('.')[0], uid + '.art.json')
    art = json.load(open(f)) if os.path.exists(f) else {}
    d = os.path.join(APP, 'content', 'media', 'img', uid); os.makedirs(d, exist_ok=True)
    for key, url in imgs.items():
        dst = os.path.join(d, key + '.webp')
        if not os.path.exists(dst):
            if subprocess.run(['curl', '-sf', '-m', '60', '-o', tmp, url]).returncode: art[key] = url; continue
            picture.save(tmp, dst)
        art[key] = f'media/img/{uid}/{key}.webp'; n += 1
    json.dump(dict(sorted(art.items())), open(f, 'w'), indent=1)
print(n, 'pictures added for', len(by), 'units')
