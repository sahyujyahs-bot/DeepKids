"""Every text size in the app is one of the 8 steps of the type scale (--fs-1 to --fs-8 in app/src/styles.css).
Fails if a font size in the stylesheet, or in an inline style="" in the code, is a pixel number between 1 and 34
instead of a step. Display sizes above 34 px (big emoji, celebration letters) are allowed. Printable documents'
own CSS is not checked: it is not the app's text."""
import glob, os, re, sys
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src')
RAW = re.compile(r'(?:font-size:\s*|font:\s*(?:italic\s+)?(?:\d{3}\s+)?)([\d.]+)px')
bad = []
def check(label, text):
    for m in RAW.finditer(text):
        if float(m.group(1)) <= 34: bad.append(f"{label}: {m.group(0).strip()}")
check('styles.css', open(os.path.join(SRC, 'styles.css')).read())
for f in sorted(glob.glob(os.path.join(SRC, 'js', '*.js'))):
    for m in re.finditer(r'style="([^"]*)"', open(f).read()):
        check(os.path.basename(f), m.group(1))
if bad:
    print('Type scale: these sizes are not steps of the scale (use var(--fs-1) to var(--fs-8)):')
    print('\n'.join(sorted(set(bad))[:40])); sys.exit(1)
print('type scale: every text size is a step of the scale')
