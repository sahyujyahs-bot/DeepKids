# App UI build pipeline

These scripts were run from a scratch folder. `apply10.py` runs the whole chain (apply10 → apply9 → apply8 → apply7 → apply6). Each step takes the logic from `../template.html`, rebuilds the UI from a base file plus the `patch_v*.js` files, writes `../template.html`, and fills in `../data.json` to produce `../../index.html`.

- `logic*.py` are one-time edits to the logic part of `template.html`, and they have already been applied. Don't run them again.
- `drive*.js` are Playwright checks. Run them as `node driveNN.js <folder containing app_prev.html>`.

To rebuild after changing content:
1. `python3 ../make_data.py`
2. `python3 apply10.py`. Run it from a copy of this folder, because it writes app_prev.html and app.js next to itself.
