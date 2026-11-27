"""Builds the packet a reviewer reads for one unit: python3 app/build/review_packet.py <unit id>
It holds what the reviewer needs in one place: the checker's findings, what the unit must cover (the curriculum and the boards),
the writer's own notes, and the whole unit as plain readable text. See app/content/REVIEW_BRIEF.md."""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
uid = sys.argv[1]
subj = uid.split(".")[0]
path = f"{ROOT}/app/content/units/{subj}/{uid}.json"
u = json.load(open(path))
cur = json.load(open(f"{ROOT}/app/content/curriculum/{subj}.json"))
entry = next((s for s in cur["subtopic_levels"] if s["id"] == uid), {})

print(f"# Review packet: {uid}\n")
print("## 1. The checker's findings (fix every one, unless you can say why it is wrong)\n")
print(subprocess.run([sys.executable, f"{ROOT}/app/build/validate_unit.py", path], capture_output=True, text=True).stdout)
print("## 2. What this unit must cover, at equal or greater depth than every board\n")
print("covers:", entry.get("covers"))
print("boards:", json.dumps(entry.get("boards") or entry.get("board_chapters") or [], ensure_ascii=False))
print("prerequisites:", entry.get("prerequisites"), "| go deeper:", entry.get("go_deep"), "| go wider:", entry.get("go_wide"))
print("\n## 3. The writer's own notes (facts still to verify, things tried)\n")
print(u.get("playtest", "(none)"))
print("\n## 4. The unit, as a family reads it\n")
md = f"/tmp/review_{uid}.md"
subprocess.run([sys.executable, f"{ROOT}/app/build/unit_to_md.py", path, md], check=True, capture_output=True)
print(open(md).read())
