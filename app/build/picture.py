"""One way to save a picture into the app: at most 800 px wide, WebP (about a third the size of the JPEG it replaces) for
unit pictures, JPEG for anything whose file name ends in .jpg (the game cards)."""
from PIL import Image


def save(src, dst, width=800):
    im = Image.open(src).convert('RGB')
    if im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    if dst.endswith('.webp'): im.save(dst, 'WEBP', quality=72, method=4)
    else: im.save(dst, 'JPEG', quality=80)
