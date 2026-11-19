"""Put a drawn set-up card into a unit: python3 app/build/add_drawing.py <unit id> <key> <png> [--replace] [--credit "..."]
The drawing (from the flat set-up kit, app/build/drawings) is saved at most 800 px wide as WebP as
app/content/media/img/<unit id>/<key>.webp and recorded in <unit id>.art.json. A key that already has a
picture is left alone unless --replace (a parent's own photo always wins over a drawing). --credit records where a picture
came from instead of marking it drawn (for example a card designed in Canva: --credit "Designed in Canva")."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import picture
APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
uid, key, png = sys.argv[1:4]
f = os.path.join(APP, 'content', 'units', uid.split('.')[0], uid + '.art.json')
art = json.load(open(f)) if os.path.exists(f) else {}
if key in art and '--replace' not in sys.argv: sys.exit(f'{key} already has a picture; leave it')
dst = os.path.join(APP, 'content', 'media', 'img', uid, key + '.webp'); os.makedirs(os.path.dirname(dst), exist_ok=True)
picture.save(png, dst)
credit = sys.argv[sys.argv.index('--credit') + 1] if '--credit' in sys.argv else None
art[key] = {'src': f'media/img/{uid}/{key}.webp', **({'credit': credit} if credit else {'drawn': True})}
json.dump(dict(sorted(art.items())), open(f, 'w'), indent=1, ensure_ascii=False)
print('ok', uid, key)
