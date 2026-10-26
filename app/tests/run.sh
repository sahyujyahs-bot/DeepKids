#!/bin/sh
# Builds the app and runs the browser checks against it.
#   sh app/tests/run.sh            quick checks (every family type, every button)
#   sh app/tests/run.sh snapshot   also writes screen snapshots to compare before/after a change
set -e
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
python3 "$ROOT/app/build/build_app.py"
SITE=$(mktemp -d)
{ printf '<meta charset="utf-8">'; cat "$ROOT/app/index.html"; } > "$SITE/app.html"
ln -s "$ROOT/app/units" "$SITE/units"; ln -s "$ROOT/app/content/media" "$SITE/media"
(cd "$SITE" && python3 -m http.server 8777 >/dev/null 2>&1) & SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1
node "$ROOT/app/tests/matrix.js" http://127.0.0.1:8777/app.html
node "$ROOT/app/tests/clickall.js" http://127.0.0.1:8777/app.html
[ "$1" = snapshot ] && node "$ROOT/app/tests/snapshot.js" http://127.0.0.1:8777/app.html "${2:-$ROOT/app/tests/snapshots}"
exit 0
