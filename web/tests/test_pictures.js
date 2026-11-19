// Unit pictures are served out of per-unit packs by the service worker (the site host allows only 20,000 files).
//   python3 web/build_web.py && node web/tests/test_pictures.js
let pw; try { pw = require('/opt/node-tools/node_modules/playwright'); } catch (e) { pw = require('playwright'); }
const { chromium } = pw;
const http = require('http'), fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public'), SRC = path.join(__dirname, '..', '..', 'app', 'content', 'media', 'img');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
// like the real host: serves byte ranges
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  const size = fs.statSync(f).size, h = { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'accept-ranges': 'bytes' };
  const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
  if (m) { const a = +m[1], b = m[2] ? +m[2] : size - 1; res.writeHead(206, { ...h, 'content-range': `bytes ${a}-${b}/${size}`, 'content-length': b - a + 1 }); return fs.createReadStream(f, { start: a, end: b }).pipe(res); }
  res.writeHead(200, { ...h, 'content-length': size }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(8799, r));
  const b = await chromium.launch(), p = await (await b.newContext()).newPage();
  let bad = 0; const check = (ok, what) => { console.log(ok ? 'ok  ' : 'FAIL', what); if (!ok) bad++; };
  const files = fs.readdirSync(PUB, { recursive: true }); check(files.length < 20000, `site has ${files.length} files (limit 20,000)`);
  await p.goto('http://localhost:8799/privacy.html', { waitUntil: 'domcontentloaded' });
  await p.evaluate(async () => { await navigator.serviceWorker.register('/sw.js'); await navigator.serviceWorker.ready; });
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1500);
  const units = fs.readdirSync(SRC).filter(u => fs.statSync(path.join(SRC, u)).isDirectory()), picks = [units[0], units[Math.floor(units.length / 2)], units[units.length - 1]];
  for (const u of picks) {
    const name = fs.readdirSync(path.join(SRC, u))[0], orig = fs.readFileSync(path.join(SRC, u, name));
    const got = await p.evaluate(async f => { const r = await fetch(f); return { s: r.status, a: Array.from(new Uint8Array(await r.arrayBuffer())) }; }, `/media/img/${u}/${name}`);
    check(got.s === 200 && Buffer.from(got.a).equals(orig), `${u}/${name} comes back byte for byte`);
  }
  check(await p.evaluate(async () => (await fetch('/media/img/sci.animals.birds.L1/nope.jpg')).status) === 404, 'a picture that does not exist is 404');
  await b.close(); server.close(); process.exit(bad ? 1 : 0);
})();
