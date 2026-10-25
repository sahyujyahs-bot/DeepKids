"""Make a first-draft melody, chords, sheet music (ABC notation) and a sing-along backing track for each song.
Usage: python3 app/build/songs/make_music.py   (reads app/content/songs/*.json, writes <id>.abc and <id>.mp3 next to them,
and adds "melody" and "chords" to each song file)
Each lyric line gets two bars. The melody follows the chord tones on strong beats and steps between them, rises in the
chorus, and ends every second line on the home note. It is a starting point for a real musician, not a finished arrangement."""
import json, os, glob, re, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); SONGS = os.path.join(HERE, '..', '..', 'content', 'songs')
SR = 22050
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
MAJOR, MINOR = [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10]
# chord progressions by scale degree (1-based), one chord per bar, cycled through each section
PROG = {'major': {'Verse': [1, 6, 4, 5], 'Chorus': [4, 5, 1, 6], 'Bridge': [6, 4, 1, 5], 'Outro': [4, 5, 1, 1]},
        'minor': {'Verse': [1, 6, 3, 7], 'Chorus': [3, 7, 1, 1], 'Bridge': [4, 1, 6, 5], 'Outro': [6, 7, 1, 1]}}
# melodic shapes (scale steps above the home note) per kind of section; the chorus sits higher
SHAPE = {'Verse': [0, 1, 2, 4, 2, 1, 2, 0], 'Chorus': [4, 5, 4, 2, 4, 5, 3, 4], 'Bridge': [5, 4, 2, 3, 4, 2, 1, 4], 'Outro': [4, 2, 1, 0, 2, 1, 0, 0]}


def syllables(line):
    n = 0
    for w in re.findall(r"[A-Za-z']+", line):
        w = w.lower(); c = len(re.findall(r'[aeiouy]+', w))
        if w.endswith('e') and not w.endswith(('le', 'ee')) and c > 1: c -= 1
        n += max(1, c)
    return max(1, n)


def kind(name):
    return next((k for k in SHAPE if name.startswith(k)), 'Verse')


def compose(s):
    key, mode = s['key'].split()[0], 'minor' if 'minor' in s['key'] else 'major'
    scale = MINOR if mode == 'minor' else MAJOR; root = 60 + NOTE[key[0]] + (1 if '#' in key else -1 if 'b' in key[1:] else 0)
    if root > 64: root -= 12
    if root < 57: root += 12                                          # keep the tune between about A3 and E5, a child's range
    beats = int(s['meter'].split('/')[0]); slots = beats * 2 * 2       # eighth notes in two bars
    deg = lambda d: root + 12 * (d // 7) + scale[d % 7]
    lines, chords = [], []
    for sec in s['sections']:
        k = kind(sec['name']); prog = PROG[mode][k]; shape = SHAPE[k]
        for li, text in enumerate(sec['lines']):
            n = min(syllables(text), slots - 2)
            bar_chords = [prog[(2 * li) % 4], prog[(2 * li + 1) % 4]]
            chords += bar_chords
            # spread the syllables over the two bars, on eighth notes, leaving the end of the line to breathe
            start = 0 if n > slots - 4 else 1
            pos = [start + round(i * (slots - 2 - start) / max(1, n)) for i in range(n)]
            notes = []
            for i, p in enumerate(pos):
                d = shape[(i + li) % len(shape)] + (0 if li % 2 == 0 else -1)
                ch = bar_chords[0 if p < slots // 2 else 1] - 1
                if p % (beats) == 0:                                   # strong beat: snap to a chord tone
                    tones = [ch, ch + 2, ch + 4, ch + 7, ch - 3]
                    d = min(tones, key=lambda t: abs(t - d))
                if i == n - 1: d = 0 if li % 2 == 1 or li == len(sec['lines']) - 1 else 4   # cadence
                dur = (pos[i + 1] if i + 1 < n else slots) - p
                notes.append((deg(d), p, dur))
            lines.append({'section': sec['name'], 'text': text, 'notes': notes})
    return {'root': root, 'mode': mode, 'scale': scale, 'beats': beats, 'slots': slots, 'lines': lines, 'chords': chords, 'deg': deg}


def chord_name(c, m):
    names = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
    pc = m['deg'](c - 1) % 12; third = (m['deg'](c + 1) - m['deg'](c - 1)) % 12
    return names[pc] + ('m' if third == 3 else '')


def abc(s, m):
    names = 'C ^C D _E E F ^F G _A A _B B'.split()
    def pitch(n):
        nm = names[n % 12]; acc, base = nm[:-1], nm[-1]; o = n // 12 - 5
        return acc + (base.lower() + "'" * (o - 1) if o >= 1 else base + ',' * (-o))
    out = [f"X:1", f"T:{s['title']}", f"C:Words: {s['lyrics_by']}. Music: DeepKids draft", f"M:{s['meter']}", "L:1/8", f"Q:1/4={s['bpm']}", f"K:{s['key'].split()[0]}{'m' if m['mode'] == 'minor' else ''}"]
    ci = 0
    for L in m['lines']:
        bars = [[], []]; t = 0
        for (n, p, d) in L['notes']:
            if p > t: bars[0 if t < m['slots'] // 2 else 1].append('z' + (str(p - t) if p - t > 1 else ''))
            # split notes that cross the bar line
            half = m['slots'] // 2
            if p < half < p + d:
                bars[0].append(pitch(n) + (str(half - p) if half - p > 1 else '') + '-'); bars[1].append(pitch(n) + (str(p + d - half) if p + d - half > 1 else ''))
            else:
                bars[0 if p < half else 1].append(pitch(n) + (str(d) if d > 1 else ''))
            t = p + d
        c1, c2 = chord_name(m['chords'][ci], m), chord_name(m['chords'][ci + 1], m); ci += 2
        out.append(f'"{c1}"' + ' '.join(bars[0]) + f' | "{c2}"' + ' '.join(bars[1]) + ' |')
        out.append('w: ' + ' '.join(re.findall(r"[A-Za-z']+", L['text'])))
    return '\n'.join(out) + '\n'


def tone(f, dur, kind='piano'):
    t = np.arange(int(SR * dur)) / SR
    if kind == 'piano':
        w = sum(a * np.sin(2 * np.pi * f * h * t) for h, a in ((1, 1), (2, .45), (3, .2), (4, .1)))
        env = np.exp(-t * 3.2) * np.minimum(1, t * 200)
    elif kind == 'bell':
        w = np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2 * t) + .12 * np.sin(2 * np.pi * f * 3 * t)
        env = np.minimum(1, t * 60) * np.exp(-t * 1.6)
    else:  # soft kick
        w = np.sin(2 * np.pi * (55 + 90 * np.exp(-t * 30)) * t); env = np.exp(-t * 14)
    return w * env


def render(s, m, path):
    eighth = 60 / s['bpm'] / 2; bar = eighth * m['slots'] // 2 if False else eighth * (m['slots'] // 2)
    total = len(m['chords']) * bar + 2
    mix = np.zeros(int(SR * total))
    def put(x, at, g):
        i = int(at * SR); j = min(len(mix), i + len(x)); mix[i:j] += g * x[:j - i]
    for bi, c in enumerate(m['chords']):
        at = bi * bar; ch = [m['deg'](c - 1) - 12, m['deg'](c + 1) - 12, m['deg'](c + 3) - 12]
        put(tone(440 * 2 ** ((m['deg'](c - 1) - 24 - 69) / 12), bar * 1.05), at, .35)          # bass
        for b in range(m['beats']):                                                           # broken chord
            n = ch[b % 3] if b else ch[0]
            put(tone(440 * 2 ** ((n - 69) / 12), eighth * 3), at + b * eighth * 2, .16)
            put(tone(440 * 2 ** ((ch[(b + 1) % 3] - 69) / 12), eighth * 2), at + b * eighth * 2 + eighth, .1)
        for b in range(0, m['beats'], 2 if m['beats'] == 4 else 3): put(tone(0, .35, 'kick'), at + b * eighth * 2, .5)
    for li, L in enumerate(m['lines']):                                                       # melody to sing along with
        for (n, p, d) in L['notes']:
            put(tone(440 * 2 ** ((n - 69) / 12), d * eighth * 1.1, 'bell'), li * 2 * bar + p * eighth, .32)
    mix /= max(1e-9, np.abs(mix).max()) / .85
    wav = path[:-4] + '.wav'
    with wave.open(wav, 'w') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-b:a', '32k', path], check=True); os.remove(wav)
    return total


for f in sorted(glob.glob(os.path.join(SONGS, '*.json'))):
    s = json.load(open(f)); m = compose(s)
    open(f[:-5] + '.abc', 'w').write(abc(s, m))
    secs = render(s, m, f[:-5] + '.mp3')
    s['chords'] = [{'text': L['text'], 'chords': [chord_name(m['chords'][2 * i], m), chord_name(m['chords'][2 * i + 1], m)]} for i, L in enumerate(m['lines'])]
    s['seconds'] = round(secs); s['audio'] = s['id'] + '.mp3'; s['sheet'] = s['id'] + '.abc'
    json.dump(s, open(f, 'w'), ensure_ascii=False, indent=1)
    print(s['id'], f"{secs:.0f}s", os.path.getsize(f[:-5] + '.mp3') // 1024, 'KB')
