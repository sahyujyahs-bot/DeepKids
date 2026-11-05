"""Finds code nobody uses, so it can go: functions and constants defined in app/src/js but never referred to,
CSS classes in styles.css that no JS or HTML mentions (classes built from a prefix, like "s-" + subject, count as
used), and button actions (case "x" in 21-actions.js) that no button sends. Part of `npm run lint`: must print nothing."""
import glob, os, re, sys
R = os.path.join(os.path.dirname(__file__), "..")
js = {f: open(f).read() for f in sorted(glob.glob(R + "/src/js/*.js"))}
alljs = "".join(js.values())
html = open(R + "/src/index.html").read() + "".join(open(f).read() for f in glob.glob(R + "/../web/src/*"))
bad = []
# 1. definitions never referred to (a name counts as used when it appears anywhere else, including after "...")
defs = []
for f, s in js.items():
    for m in re.finditer(r"^(?:async\s+)?function\s+([\w$]+)|^(?:const|let|var)\s+([\w$]+)\s*=", s, re.M):
        defs.append((m.group(1) or m.group(2), os.path.basename(f), s[: m.start()].count("\n") + 1))
    for m in re.finditer(r"^(?:const|let|var)\s+(.+?);$", s, re.M | re.S):
        for n in re.findall(r"(?:^|,)\s*([\w$]+)\s*=", m.group(1)):
            defs.append((n, os.path.basename(f), s[: m.start()].count("\n") + 1))
seen = set()
for n, f, l in defs:
    if n in seen:
        continue
    seen.add(n)
    uses = len(re.findall(r"(?<![\w$])(?<!(?<!\.)\.)" + re.escape(n) + r"(?![\w$])", alljs))
    if uses <= 1 and not re.search(r"(?<![\w$])" + re.escape(n) + r"(?![\w$])", html):
        bad.append(f"{f}:{l} {n} is never used")
# 2. CSS classes nothing mentions
css = re.sub(r"/\*.*?\*/", "", open(R + "/src/styles.css").read(), flags=re.S)
cls = set()
for sel in re.findall(r"([^{}]+)\{", css):
    if not sel.strip().startswith("@"):
        cls |= set(re.findall(r"\.([a-zA-Z_][\w-]*)", sel))
hay = alljs + html
dyn = set(re.findall(r"([a-zA-Z]+-)\$\{", alljs)) | {p + "-" for p in re.findall(r'"([a-zA-Z]+)-"\s*\+', alljs)}
for c in sorted(cls):
    if not re.search(r"(?<![\w-])" + re.escape(c) + r"(?![\w-])", hay) and not any(c.startswith(p) for p in dyn):
        bad.append(f"styles.css .{c} is never used")
# 3. actions no button sends
acts = js[R + "/src/js/21-actions.js"]
emit = set(re.findall(r'data-act="([^"$]+)"', alljs)) | set(re.findall(r'act:\s*"([^"]+)"', alljs))
for c in sorted(set(re.findall(r'case "([^"]+)":', acts))):
    if c not in emit and not re.search(r"[\"'`]" + re.escape(c) + r"[\"'`]", alljs.replace('case "' + c + '"', "")):
        bad.append(f'21-actions.js: no button sends data-act="{c}"')
print("\n".join(bad) if bad else "dead code: none")
sys.exit(1 if bad else 0)
