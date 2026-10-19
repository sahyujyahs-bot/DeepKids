"""Builds app data (data.json) and the collated table (DeepKids_Board_Topics_Collated.xlsx)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from sci_l1_data import T
from boards import RES, WEEKS
from catalog import *
from ncert_evs_content import C as EVS
from c3_daily import X as C3X
from c3_time_cur import H as C3H, CUR as C3CUR, JOKE_BOOK
from c3_deep import THINK as C3T, WS as C3W

items = []  # every learnable unit: a board chapter/strand/theme, or a DeepKids topic
def add(**k): items.append(k)

for (subj, lvl), (book, chs) in NCERT.items():
    for i, title in enumerate(chs, 1):
        add(k=f"ncert|{subj}|{lvl}|{i}", board="ncert", subj=subj, level=lvl, book=f"{book} · Class {lvl}", n=str(i), title=title,
            dk=NCERT_DK.get((lvl, i), []) if subj == "sci" else [],
            c=({**{k: v for k, v in EVS[(lvl, i)].items() if k != "dk"}, **({"x": {**C3X[i], "hours": C3H[i], "cur": C3CUR[i], "deep": C3T[i], "wsd": C3W[i]}} if lvl == 3 and i in C3X else {})} if subj == "sci" and (lvl, i) in EVS else None))
for subj, (book, strands) in CAMBRIDGE.items():
    for lvl in LEVELS:
        for i, s in enumerate(strands, 1):
            add(k=f"cam|{subj}|{lvl}|{i}", board="cambridge", subj=subj, level=lvl, book=f"{book} · Stage {lvl}", n="Strand", title=s,
                dk=CAMBRIDGE_DK.get(s, []) if subj == "sci" and lvl == 1 else [])
for lvl in LEVELS:
    book, themes = NIOS["sci"]
    for i, th in enumerate(themes, 1):
        add(k=f"nios|sci|{lvl}|{i}", board="nios", subj="sci", level=lvl, book=f"Level {nios_level(lvl)} · {book}", n="Theme", title=th,
            dk=NIOS_DK.get(th, []) if lvl == 1 else [])

topics = []
for t in T:
    topics.append({"id": t["id"], "q": t["q"], "name": t["topic"], "sub": [s.strip("• ").strip() for s in t["subtopics"].split("\n") if s.strip()],
                   "summary": t["summary"], "oneness": t["oneness"], "weeks": WEEKS[t["id"]], "full": t["id"] == "A1",
                   "res": [{"type": a, "title": b, "url": c} for a, b, c in RES.get(t["id"], [])]})

data = {"jokebook": JOKE_BOOK, "levels": {str(k): {"cls": v[0], "age": v[1]} for k, v in LEVELS.items()}, "subjects": SUBJECTS, "items": items, "topics": topics,
        "notes": {"ncert": {f"{s}|{l}": n for (s, l), n in NCERT_NOTES.items()},
                  "nios": {s: f"NIOS Level A/B {n}: lesson list to be added from NIOS study material." for s, n in NIOS_PENDING.items()},
                  "cambridge": {"hin": "Cambridge Primary has no Hindi course. Pair with NCERT Hindi or DeepKids language plans."}}}
json.dump(data, open(os.path.join(HERE, "data.json"), "w"), ensure_ascii=False, separators=(",", ":"))

# ---------- collated spreadsheet ----------
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
F = "Arial"; HDR = PatternFill("solid", fgColor="1F3A5F")
TNAME = {t["id"]: t["topic"] for t in T}
BNAME = {"ncert": "NCERT / CBSE", "cambridge": "Cambridge Primary", "nios": "NIOS OBE"}
wb = Workbook(); ws = wb.active; ws.title = "All boards"
cols = ["Board", "Subject", "DeepKids level", "Class", "Age", "NIOS level", "Book / framework", "Chapter no.", "Chapter / strand / theme", "DeepKids Science L1 topics linked", "Verify"]
ws.append(cols)
def row(it):
    c, a = LEVELS[it["level"]]
    return [BNAME[it["board"]], SUBJECTS[it["subj"]], it["level"], c, a, nios_level(it["level"]), it["book"], it["n"], it["title"],
            "; ".join(f"{d} {TNAME[d]}" for d in it["dk"]), "Titles from secondary listings" if it["board"] == "ncert" else ("Unit names from Learner's Books to add" if it["board"] == "cambridge" else "Lesson list to add")]
for it in sorted(items, key=lambda x: (x["board"], x["subj"], x["level"])): ws.append(row(it))
for (s, l), note in NCERT_NOTES.items():
    c, a = LEVELS[l]; ws.append(["NCERT / CBSE", SUBJECTS[s], l, c, a, nios_level(l), "(no book)", "", note, "Use DeepKids Science Plus", ""])
for s, n in NIOS_PENDING.items():
    ws.append(["NIOS OBE", SUBJECTS[s], "1–5", "1–5", "6–10", "A / B", n, "", "Lesson list to be added from NIOS study material", "", "Pending"])
ws2 = wb.create_sheet("DeepKids Plus · Science L1")
ws2.append(["Topic ID", "Big question", "Topic", "DeepKids level", "Class", "Age", "Subtopics", "NCERT EVS chapters linked (Cl 3–5)"])
rev = {}
for (l, n), ids in NCERT_DK.items():
    for d in ids: rev.setdefault(d, []).append(f"Cl {l} Ch {n} {NCERT[('sci', l)][1][n-1]}")
for t in T:
    ws2.append([t["id"], t["q"], t["topic"], 1, 1, 6, t["subtopics"].replace("• ", ""), "; ".join(rev.get(t["id"], [])) or "Beyond board syllabus"])
ws4 = wb.create_sheet("NCERT EVS · games & projects")
ws4.append(["Level", "Class", "Ch", "Chapter", "What it covers", "Game", "How to play", "Experiments", "Activities", "Project", "Project steps", "You end up with", "Extra reading", "Other NCERT books (same class)", "DeepKids Plus topics"])
for (l, n), c in sorted(EVS.items()):
    ws4.append([l, l, n, NCERT[("sci", l)][1][n-1], c["covers"], c["game"][0], c["game"][1], "\n".join(c["exp"]), "\n".join(c["act"]), c["proj"][0], c["proj"][1], c["proj"][2], "\n".join(c["read"]), "\n".join(c["links"]), "; ".join(f"{d} {TNAME[d]}" for d in c["dk"])])
ws3 = wb.create_sheet("Level map")
ws3.append(["DeepKids level", "NCERT class", "Cambridge stage", "NIOS OBE", "Age"])
for l, (c, a) in LEVELS.items(): ws3.append([l, c, c, f"Prepares for Level {nios_level(l)}" + (" (≈Class 3)" if l <= 3 else " (≈Class 5)"), a])
for w in (ws, ws2, ws3, ws4):
    for cell in w[1]: cell.font = Font(name=F, bold=True, color="FFFFFF"); cell.fill = HDR; cell.alignment = Alignment(wrap_text=True)
    for r in w.iter_rows(min_row=2):
        for cell in r: cell.font = Font(name=F, size=10); cell.alignment = Alignment(wrap_text=True, vertical="top")
    w.freeze_panes = "A2"; w.auto_filter.ref = w.dimensions
for i, wdt in enumerate([14, 14, 9, 7, 6, 8, 34, 9, 40, 44, 26], 1): ws.column_dimensions[get_column_letter(i)].width = wdt
for i, wdt in enumerate([8, 20, 32, 9, 7, 6, 70, 60], 1): ws2.column_dimensions[get_column_letter(i)].width = wdt
for i, wdt in enumerate([12, 12, 14, 34, 8], 1): ws3.column_dimensions[get_column_letter(i)].width = wdt
for i, wdt in enumerate([6, 6, 4, 22, 40, 18, 60, 50, 45, 20, 50, 26, 34, 34, 26], 1): ws4.column_dimensions[get_column_letter(i)].width = wdt
out = os.path.join(HERE, "..", "DeepKids_Board_Topics_Collated.xlsx"); wb.save(out)
print(len(items), "items;", len(topics), "DeepKids topics; xlsx:", os.path.abspath(out))
