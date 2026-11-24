"""Every word of a lesson, all parts open, as a PDF for printing and proofreading.
Usage: python3 app/build/unit_to_pdf.py <unit.json> <out.pdf>   (needs pandoc-free Chromium through Playwright for node)
Nothing is left out: every text in the lesson file is printed, in the order the app shows it. Check: the script
counts the texts it could not find in its own output and says so."""
import json, sys, re, html, os, subprocess
ORDER = ["summary", "intro", "outcomes", "terms", "explanations", "agreed", "challenging", "big_questions", "story", "how_we_found_out",
         "games", "experiments", "activities", "projects", "challenges", "worksheets", "quiz", "videos", "applications", "spotted",
         "open_questions", "ask_kids", "jokes", "maths", "warmup", "song", "roots", "links", "buy", "sources", "plan", "playtest"]
TITLE = {"summary": "Summary", "intro": "Before we begin", "outcomes": "By the end I can", "terms": "Words to know", "explanations": "Explanations",
         "agreed": "What most scientists agree on", "challenging": "Views that challenge the usual story", "big_questions": "Big questions",
         "story": "Story", "how_we_found_out": "How we found out", "games": "Games", "experiments": "Experiments", "activities": "Activities",
         "projects": "Projects", "challenges": "Challenges", "worksheets": "Worksheets", "quiz": "Quiz", "videos": "Videos",
         "applications": "Where this idea is used", "spotted": "Spot it around us", "open_questions": "Questions nobody can answer yet",
         "ask_kids": "Questions to ask during the day", "jokes": "Jokes", "maths": "Maths problems", "warmup": "Warm-up questions",
         "song": "Song", "roots": "Roots", "links": "Links", "buy": "Things to buy", "sources": "Sources", "plan": "Plan", "playtest": "Walk-through notes"}
LABEL = {"kid": "Child mode", "say": "Parent says", "do": "Parent does", "a": "Answer", "p": "Prompt", "q": "Question", "opts": "Options",
         "why": "Why", "t": "Type", "art": "Picture", "mins": "Minutes", "adult": "Grown-up needed", "who": "Who", "for": "For", "against": "Against",
         "h": "Back", "f": "Front", "j": "Joke", "text": "Text", "ask": "Ask", "good": "Good answers", "parent": "Note for the parent"}
HEAD = ("title", "concept", "term", "q", "claim", "id", "who", "item", "problem", "j")
ART = {}
def small(f):
    """a light JPEG copy of a picture (the PDF stays a few MB instead of tens)"""
    from PIL import Image
    out = os.path.join("/tmp/dk_pdf_img", os.path.relpath(f, "/").replace("/", "_") + ".jpg")
    if not os.path.exists(out):
        os.makedirs("/tmp/dk_pdf_img", exist_ok=True)
        im = Image.open(f).convert("RGB"); im.thumbnail((800, 800)); im.save(out, "JPEG", quality=72)
    return out
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def pic(key):
    """the picture for an art key, if the lesson has one drawn: the image, then its credit"""
    a = ART.get(key)
    if not a: return ""
    src = a.get("src") if isinstance(a, dict) else a
    f = os.path.join(APP, "content", src) if src else ""
    if not (src and os.path.exists(f)): return ""
    credit = a.get("credit") if isinstance(a, dict) else ""
    f = small(f)
    return f'<div class="im"><img src="file://{f}">' + (f'<div class="cr">Credit: {esc(credit)}</div>' if credit else "") + "</div>"
ARTKEY = {"terms": lambda i, d: f"term.{i}", "explanations": lambda i, d: f"expl.{i}", "spotted": lambda i, d: f"spot.{i}",
          "big_questions": lambda i, d: f"bq.{i}", "challenging": lambda i, d: f"chal.{i}", "worksheets": lambda i, d: f"ws.{d.get('id')}"}
for _k in ("games", "experiments", "activities", "projects", "challenges"): ARTKEY[_k] = lambda i, d: f"flow.{d.get('id')}"
SECTION = {"summary": "summary", "intro": "intro", "story": "story.0", "agreed": "agreed", "jokes": "jokes", "maths": "maths", "song": "song",
           "quiz": "quiz", "links": "links", "buy": "buy", "open_questions": "open", "applications": "apps", "ask_kids": "askk", "roots": "roots.0"}
def label(k): return LABEL.get(k) or k.replace("_", " ").capitalize()
def esc(s): return html.escape(str(s))
def val(x, key="", ak=None):
    if isinstance(x, (str, int, float)): return f"<span>{esc(x)}</span>"
    if isinstance(x, bool): return "yes" if x else "no"
    if x is None: return ""
    if isinstance(x, list):
        if not x: return ""
        if all(isinstance(i, (str, int, float)) for i in x): return "<ul>" + "".join(f"<li>{esc(i)}</li>" for i in x) + "</ul>"
        return "".join(f'<div class="it">{item(i, n + 1, ARTKEY[key](n, i) if key in ARTKEY and isinstance(i, dict) else None)}</div>' for n, i in enumerate(x))
    if isinstance(x, dict): return item(x, 0, ak)
    return esc(x)
def item(d, n, ak=None, prefix=None):
    if not isinstance(d, dict): return val(d)
    d = dict(d); h = ""; did = d.get("id")
    for k in HEAD:
        if isinstance(d.get(k), str) and len(d[k]) < 140:
            h = f'<h4>{(str(n) + ". ") if n else ""}{esc(d.pop(k))}</h4>'; break
    if not h and n: h = f"<h4>{n}.</h4>"
    # a multiple-choice or checking answer is an index into its options: say the words as well
    for ok in ("opts", "options"):
        if isinstance(d.get(ok), list) and isinstance(d.get("a"), int) and 0 <= d["a"] < len(d[ok]):
            d["a"] = f'{d["a"]}: {d[ok][d["a"]]}'
    rows = [pic(ak)] if ak else []
    for k, v in d.items():
        cls = "pic" if k == "art" else ""
        if isinstance(v, (str, int, float)) and not isinstance(v, bool):
            rows.append(f'<p class="{cls}"><b>{esc(label(k))}:</b> {esc(v)}</p>')
        elif v in (None, [], {}): continue
        elif isinstance(v, bool): rows.append(f"<p><b>{esc(label(k))}:</b> {'yes' if v else 'no'}</p>")
        elif k == "setup" and isinstance(v, list) and did:
            rows.append('<div class="sub"><b>Setup:</b>' + "".join(f'<div class="it">{item(s, i + 1, f"setup.{did}.{i}")}</div>' for i, s in enumerate(v)) + "</div>")
        else: rows.append(f'<div class="sub"><b>{esc(label(k))}:</b>{val(v, k)}</div>')
    return h + "".join(rows)
def build(u):
    out = [f'<p class="id">{esc(u["id"])} · Level {esc(u.get("level", ""))} · for proofreading</p><h1>{esc(u.get("title", ""))}</h1>']
    keys = [k for k in ORDER if k in u] + [k for k in u if k not in ORDER and k not in ("id", "title", "level")]
    for k in keys:
        sec = SECTION.get(k)
        out.append(f'<h2>{esc(TITLE.get(k, label(k)))}</h2>' + (pic(sec) if sec and not isinstance(u[k], dict) else "") + val(u[k], k, sec))
    return "".join(out)
CSS = """<style>
body{font:10.5pt/1.4 "Noto Sans","DejaVu Sans",sans-serif;color:#111}
h1{font-size:19pt;margin:0 0 6pt}h2{font-size:14pt;margin:18pt 0 4pt;border-bottom:1.5px solid #666;padding-bottom:2pt;break-after:avoid;break-before:auto}
h4{font-size:11.5pt;margin:9pt 0 2pt;break-after:avoid}p{margin:2pt 0}ul{padding-left:15pt;margin:2pt 0}li{margin:1pt 0}
.it{border-left:2px solid #bbb;padding-left:7pt;margin:5pt 0}.im{margin:4pt 0;break-inside:avoid}.im img{max-width:46%;max-height:60mm;border:1px solid #ccc;border-radius:3pt}.cr{font-size:8pt;color:#666}.sub{margin:2pt 0 2pt 8pt}.pic{color:#666;font-size:9pt}.id{color:#555;font-size:9pt;margin:0}
</style>"""
def texts(x, acc):
    if isinstance(x, str): acc.append(x)
    elif isinstance(x, list): [texts(i, acc) for i in x]
    elif isinstance(x, dict): [texts(v, acc) for v in x.values()]
    return acc
def make(unit, pdf):
    u = json.load(open(unit)); ART.clear()
    af = unit[:-5] + ".art.json"
    if os.path.exists(af): ART.update(json.load(open(af)))
    body = build(u)
    plain = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", body)))
    miss = [t for t in texts(u, []) if re.sub(r"\s+", " ", t.strip()) and re.sub(r"\s+", " ", t.strip()) not in plain]
    tmp = pdf + ".html"; open(tmp, "w").write(f'<!doctype html><meta charset="utf-8">{CSS}{body}')
    subprocess.run(["node", os.path.join(os.path.dirname(os.path.abspath(__file__)), "html_to_pdf.js"), os.path.abspath(tmp), os.path.abspath(pdf)], check=True)
    os.remove(tmp)
    return len(miss), miss[:3]
if __name__ == "__main__":
    n, ex = make(sys.argv[1], sys.argv[2]); print("texts missing from the PDF:", n, ex)
