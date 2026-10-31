"""Put a drawn set-up card into a unit: python3 app/build/add_drawing.py <unit id> <key> <png> [--replace]
The drawing (from the flat set-up kit, app/build/drawings) is saved at most 900 px as
app/content/media/img/<unit id>/<key>.jpg and recorded in <unit id>.art.json. A key that already has a
picture is left alone unless --replace (a parent's own photo always wins over a drawing)."""
import json, os, subprocess, sys
APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
uid, key, png = sys.argv[1:4]
f = os.path.join(APP, 'content', 'units', uid.split('.')[0], uid + '.art.json')
art = json.load(open(f)) if os.path.exists(f) else {}
if key in art and '--replace' not in sys.argv: sys.exit(f'{key} already has a picture; leave it')
dst = os.path.join(APP, 'content', 'media', 'img', uid, key + '.jpg'); os.makedirs(os.path.dirname(dst), exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', png, '-vf', 'scale=min(900\\,iw):-2', '-q:v', '4', dst], check=True)
art[key] = {'src': f'media/img/{uid}/{key}.jpg', 'drawn': True}
json.dump(dict(sorted(art.items())), open(f, 'w'), indent=1, ensure_ascii=False)
print('ok', uid, key)
