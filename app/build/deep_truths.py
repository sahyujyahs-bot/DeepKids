"""List every unit's deep truth, so a writer can check that a new one says something no other unit says.
Usage: python3 app/build/deep_truths.py [folder]   (default app/content/units/sci)"""
import json, glob, os, sys

folder = sys.argv[1] if len(sys.argv) > 1 else "app/content/units/sci"
for f in sorted(glob.glob(os.path.join(folder, "*.json"))):
    try:
        print(f"{os.path.basename(f)[:-5]}: {json.load(open(f))['roots']['deep_truth']['truth']}")
    except Exception:
        pass
