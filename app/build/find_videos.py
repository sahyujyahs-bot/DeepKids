"""Fill and verify unit videos with YouTube's public oEmbed check and search page.
Usage: python3 app/build/find_videos.py [--apply] <unit.json ...>
For each video: an existing id is checked with oEmbed (exists, title, channel). A 'find-id' video gets the top search
results for its title and channel; the first whose channel matches the named channel (or the first result) is proposed.
--apply writes found ids with a check note saying how it was matched; review the printed list."""
import json, re, subprocess, sys, urllib.parse
def get(u): return subprocess.run(['curl', '-s', '-m', '25', '-A', 'Mozilla/5.0', u], capture_output=True, text=True).stdout
def oembed(i):
    t = get('https://www.youtube.com/oembed?format=json&url=' + urllib.parse.quote('https://www.youtube.com/watch?v=' + i))
    try: j = json.loads(t); return j['title'], j['author_name']
    except Exception: return None
def search(q):
    h = get('https://www.youtube.com/results?search_query=' + urllib.parse.quote(q)); out = []
    for i in re.findall(r'"videoRenderer":\{"videoId":"([\w-]{11})"', h):
        if i not in out: out.append(i)
    return out[:5]
apply = '--apply' in sys.argv
for f in [a for a in sys.argv[1:] if a.endswith('.json')]:
    u = json.load(open(f)); changed = False
    for v in u['videos']:
        if v.get('youtube'):
            o = oembed(v['youtube']); print(('OK  ' if o else 'DEAD'), v['youtube'], o or v['title'])
            if not o and apply: v['youtube'] = ''; v['status'] = 'find-id'; changed = True
            if not o: pass
            else: continue
        want = (v.get('channel') or '').lower()
        cands = [(i, oembed(i)) for i in search(v['title'] + ' ' + (v.get('channel') or ''))]
        cands = [(i, o) for i, o in cands if o]
        pick = next(((i, o) for i, o in cands if want and any(w in o[1].lower() for w in want.split() if len(w) > 3)), cands[0] if cands else None)
        print('FIND', v['title'][:50], '->', pick[0] if pick else None, pick[1] if pick else '')
        if pick and apply:
            v['youtube'] = pick[0]; v.pop('status', None); changed = True
            v['check'] = f'Found by YouTube search: "{pick[1][0]}" by {pick[1][1]}. Title checked automatically; a parent may still preview it.'
    if changed: json.dump(u, open(f, 'w'), ensure_ascii=False, indent=1)
