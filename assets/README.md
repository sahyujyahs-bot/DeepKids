# Assets

- `css/main.css`, `js/*.js` — readable sources. Edit these.
- `css/main.min.css`, `js/*.min.js` — minified copies served by `/clearedcode/index.html`.

After editing a source file, regenerate its minified copy:

```sh
npm install -g terser clean-css-cli   # once
terser assets/js/<name>.js -c -m --safari10 -o assets/js/<name>.min.js
cleancss -o assets/css/main.min.css assets/css/main.css
```

JS load order (classic scripts, shared globals):
core → hero → sections → howtoplay → games → ui → extras.
`core.js` defines `EGAudio` (all sound + asset-path resolution) and the
scroll-reveal helpers `egToggleOnView` / `egRevealOnce`.
