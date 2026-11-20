"""List the step pictures whose step text was rewritten after <rev>, so the picture may no longer match.
    python3 app/build/pictures_to_redo.py <rev> [handled.json ...]   -> app/content/PICTURES_TO_REDO.json
A picture is listed when its set-up caption or art description changed since <rev> and the picture file exists.
Each handled.json is a list of {unit, key} already redrawn or checked; those are left out."""
import glob, json, os, subprocess, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
rev = sys.argv[1]
handled = {(x['unit'], x['key']) for f in sys.argv[2:] for x in json.load(open(f))}


def setups(u):
    d = {}
    for k in ('experiments', 'activities', 'games', 'projects', 'challenges'):
        for x in u.get(k, []):
            for j, s in enumerate(x.get('setup') or []):
                if isinstance(s, dict): d[f"setup.{x['id']}.{j}"] = (s.get('art', ''), s.get('caption', ''), x['title'])
    return d


out = []
for f in sorted(glob.glob(os.path.join(ROOT, 'app/content/units/sci/sci.*.json'))):
    if f.endswith(('art.json', 'steps.json', 'models.json', 'photos.json')): continue
    uid = os.path.basename(f)[:-5]
    try: u = json.load(open(f))
    except ValueError: continue
    if not isinstance(u, dict): continue
    r = subprocess.run(['git', 'show', f'{rev}:app/content/units/sci/{uid}.json'], capture_output=True, text=True, cwd=ROOT)
    if r.returncode: continue
    old = setups(json.loads(r.stdout))
    for k, (art, cap, title) in setups(u).items():
        if k in old and (old[k][0] != art or old[k][1] != cap) and (uid, k) not in handled \
                and os.path.exists(os.path.join(ROOT, 'app/content/media/img', uid, k + '.webp')):
            out.append({'unit': uid, 'key': k, 'title': title, 'old_caption': old[k][1], 'caption': cap, 'art': art})
json.dump(out, open(os.path.join(ROOT, 'app/content/PICTURES_TO_REDO.json'), 'w'), ensure_ascii=False, indent=1)
print(len(out), 'pictures listed in app/content/PICTURES_TO_REDO.json')
