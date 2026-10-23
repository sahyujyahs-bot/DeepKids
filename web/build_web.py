"""Build the DeepKids website (web/public) from the same app the artifact runs.

    python3 web/build_web.py

Reads app/build/template.html (the app after all UI patches) and app/build/data.json (all content),
and writes web/public/: index.html, app.js, data.js, platform.js, sw.js, manifest, icons, _headers.
web/public/config.js is written once with empty values; fill it in (see web/SETUP.md) and it is never overwritten.
"""
import hashlib, json, os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, 'web')
PUB = os.path.join(WEB, 'public')
T = open(os.path.join(ROOT, 'app/build/template.html')).read()
DATA = open(os.path.join(ROOT, 'app/build/data.json')).read()

pre, script = T[:T.index('<script>')], T[T.index('<script>') + 8:T.rindex('</script>')]
cut = pre.index('</style>') + len('</style>')
head, body = pre[:cut], pre[cut:]
assert script.count('/*DATA*/') == 1
script = script.replace('/*DATA*/', 'window.DK_DATA')

# Wording that only makes sense inside claude.ai
WORDS = [
    ('Everything is saved privately to your claude.ai account', 'Everything is saved privately to your DeepKids account'),
    ('Files can be saved when DeepKids is open in claude.ai.', 'Files couldn\u2019t be saved just now. Check your connection and try again.'),
    ('Saving files works when DeepKids is open in claude.ai.', 'Saving files needs a connection.'),
    ('Live calendars work when DeepKids is open in claude.ai.', 'Linking Google Calendar is coming soon on the website. Use the reminder file or calendar import below for now.'),
    # Claude-powered features: without Plus (or with config ai:false) they say they're part of DeepKids Plus
    ('Making the paper needs Claude: open DeepKids in claude.ai.', 'Making test papers is part of DeepKids Plus.'),
    ("Creating topics needs Claude, which isn't available in this view.", 'Exploring new topics is part of DeepKids Plus.'),
    ("Sorting needs Claude, which isn't available in this view. Add things one by one below.", 'Sorting lists and photos is part of DeepKids Plus. Add things one by one below.'),
    ("Sorting needs Claude, which isn't available in this view. Use Add by hand instead.", 'Smart sorting is part of DeepKids Plus. Use Add by hand for now.'),
    ("Sorting needs Claude, which isn't available in this view.", 'Smart sorting is part of DeepKids Plus. Use Add by hand for now.'),
]
for a, b in WORDS:
    script = script.replace(a, b)
# The claude.ai frame owned the page title and viewport; the website sets them itself
head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">', '')

# Google Calendar linking runs through claude.ai connectors in the artifact; on the website it waits for Google sign-in scopes
assert script.count('function calendarCard(){') == 1
script = script.replace('function calendarCard(){', '''function calendarCard(){if(window.DK_PLATFORM?.name==="web")return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)",14,"happy","",'width="46" height="46"')}<div><h3 style="font-size:19px">Your calendars</h3><p class="xs muted">Live Google Calendar linking is coming soon. For now, bring in a calendar file: you choose what to keep.</p></div></div><p class="xs muted">Google Calendar on a computer: Settings → Import & export → Export, then unzip. Apple Calendar on a Mac: File → Export.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></section>`;''',1)

app_hash = hashlib.sha256(script.encode()).hexdigest()[:10]
data_hash = hashlib.sha256(DATA.encode()).hexdigest()[:10]
build = app_hash + data_hash[:4]

os.makedirs(os.path.join(PUB, 'icons'), exist_ok=True)
open(os.path.join(PUB, 'app.js'), 'w').write(script)
open(os.path.join(PUB, 'data.js'), 'w').write('window.DK_DATA=' + DATA + ';\n')
shutil.copy(os.path.join(WEB, 'src/platform.js'), os.path.join(PUB, 'platform.js'))
open(os.path.join(PUB, 'sw.js'), 'w').write(open(os.path.join(WEB, 'src/sw.js')).read().replace('__BUILD__', build))

cfg = os.path.join(PUB, 'config.js')
if not os.path.exists(cfg):
    open(cfg, 'w').write('''/* Fill these in from Supabase: Project Settings -> API (see web/SETUP.md). The anon key is meant to be public. */
window.DK_CONFIG = {
  supabaseUrl: "",       // e.g. https://abcdefghijkl.supabase.co
  supabaseAnonKey: "",   // the "anon" / "publishable" key
  functionsUrl: "",      // leave empty to use <supabaseUrl>/functions/v1/claude
  ai: "plus"             // false = Claude off; "plus" = only families with DeepKids Plus; true = everyone
};
''')

index = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#FFF6EC">
<meta name="description" content="DeepKids: a homeschool planner and lesson guide for Indian families with children aged 6 to 10. NCERT, Cambridge and NIOS.">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="DeepKids">
{head}
<style>html,body{{margin:0;background:var(--bg,#FFF6EC)}}#dkLoading{{position:fixed;inset:0;display:grid;place-items:center;font:600 18px system-ui,sans-serif;color:#2B2340;background:#FFF6EC}}</style>
</head>
<body>
<div id="dkLoading">DeepKids is opening…</div>
{body}
<script>window.DK_BUILD="{build}"</script>
<script src="/config.js?v={build}"></script>
<script src="/vendor/supabase-2.118.0.js"></script>
<script src="/platform.js?v={build}"></script>
</body>
</html>
'''
open(os.path.join(PUB, 'index.html'), 'w').write(index)

manifest = {
    "name": "DeepKids", "short_name": "DeepKids",
    "description": "Homeschool planner and lessons for Indian families, ages 6 to 10.",
    "start_url": "/", "scope": "/", "display": "standalone", "orientation": "portrait",
    "background_color": "#FFF6EC", "theme_color": "#FFF6EC",
    "icons": [
        {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        {"src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        {"src": "/icons/icon.svg", "sizes": "any", "type": "image/svg+xml"},
    ],
}
open(os.path.join(PUB, 'manifest.webmanifest'), 'w').write(json.dumps(manifest, indent=1))

# Icons: the app's periwinkle blob friend on warm paper
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#FFF6EC"/>
<path d="M256 70c96 0 186 62 186 178 0 120-88 194-190 194S70 372 70 256C70 146 160 70 256 70z" fill="#8E8DD8"/>
<circle cx="200" cy="236" r="22" fill="#2B2340"/><circle cx="312" cy="236" r="22" fill="#2B2340"/>
<circle cx="207" cy="229" r="7" fill="#fff"/><circle cx="319" cy="229" r="7" fill="#fff"/>
<circle cx="160" cy="290" r="22" fill="#F7A8C4" opacity=".8"/><circle cx="352" cy="290" r="22" fill="#F7A8C4" opacity=".8"/>
<path d="M214 300c22 26 62 26 84 0" stroke="#2B2340" stroke-width="16" fill="none" stroke-linecap="round"/></svg>'''
open(os.path.join(PUB, 'icons/icon.svg'), 'w').write(svg)
try:
    from PIL import Image, ImageDraw
    def icon(size, pad):
        s = 4 * size; im = Image.new('RGBA', (s, s), (255, 246, 236, 255)); d = ImageDraw.Draw(im)
        k = s / 512; m = pad * k
        box = lambda x0, y0, x1, y1: [m + x0 * k * (1 - 2 * pad / 512), m + y0 * k * (1 - 2 * pad / 512), m + x1 * k * (1 - 2 * pad / 512), m + y1 * k * (1 - 2 * pad / 512)]
        d.ellipse(box(70, 70, 442, 442), fill=(142, 141, 216))
        for cx in (200, 312):
            d.ellipse(box(cx - 22, 214, cx + 22, 258), fill=(43, 35, 64)); d.ellipse(box(cx, 222, cx + 14, 236), fill=(255, 255, 255))
        for cx in (160, 352):
            d.ellipse(box(cx - 22, 268, cx + 22, 312), fill=(247, 168, 196))
        d.arc(box(206, 250, 306, 330), 20, 160, fill=(43, 35, 64), width=int(16 * k))
        return im.resize((size, size), Image.LANCZOS)
    icon(192, 0).save(os.path.join(PUB, 'icons/icon-192.png'))
    icon(512, 0).save(os.path.join(PUB, 'icons/icon-512.png'))
    icon(512, 60).save(os.path.join(PUB, 'icons/maskable-512.png'))
except ImportError:
    print('PIL not installed: PNG icons not regenerated')

open(os.path.join(PUB, '_headers'), 'w').write('''/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(self), microphone=(self), geolocation=()
  X-Frame-Options: DENY

/index.html
  Cache-Control: no-cache
/
  Cache-Control: no-cache
/sw.js
  Cache-Control: no-cache
/config.js
  Cache-Control: no-cache
/app.js
  Cache-Control: public, max-age=31536000, immutable
/data.js
  Cache-Control: public, max-age=31536000, immutable
/platform.js
  Cache-Control: public, max-age=31536000, immutable
/vendor/*
  Cache-Control: public, max-age=31536000, immutable
''')
print('built web/public', build, f'app.js {len(script)//1024} KB, data.js {len(DATA)//1024} KB')
