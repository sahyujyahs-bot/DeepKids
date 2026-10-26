"""Build the app from its source in app/src.

    python3 app/build/build_app.py

app/src/index.html is the page shell, app/src/styles.css the one stylesheet, and app/src/js/*.js the code,
joined in file-name order into one classic script (the files share one global scope, so order matters for
`const` and code that runs at load; functions can live anywhere).
Writes app/build/template.html (content left out as /*DATA*/, used by web/build_web.py) and
app/index.html (the single-file app with all content inside, used as the claude.ai artifact).
"""
import glob, os

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(APP, 'src')

shell = open(os.path.join(SRC, 'index.html')).read()
css = open(os.path.join(SRC, 'styles.css')).read()
js = '\n'.join(open(f).read() for f in sorted(glob.glob(os.path.join(SRC, 'js', '*.js'))))
assert js.count('/*DATA*/ null') == 1, 'exactly one /*DATA*/ null placeholder (const DATA in js/01-core.js)'

page = (shell.replace('<!-- styles.css goes here -->', '<style>\n' + css + '</style>')
             .replace('<!-- js/*.js go here, in file-name order -->', '<script>\n' + js + '</script>'))
open(os.path.join(APP, 'build', 'template.html'), 'w').write(page)
open(os.path.join(APP, 'build', 'app.lint.js'), 'w').write(js)  # the joined code, for `npm run lint`
data = open(os.path.join(APP, 'build', 'data.json')).read()
open(os.path.join(APP, 'index.html'), 'w').write(page.replace('/*DATA*/ null', data, 1))
print('built app/index.html', len(page) // 1024, 'KB code +', len(data) // 1024, 'KB content')
