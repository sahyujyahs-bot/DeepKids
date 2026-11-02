// A family saved under the older phone-number log-in comes back when the same Google account signs in on a
// browser with nothing saved, instead of a fresh set-up.   python3 web/build_web.py && node web/tests/test_older_family.js
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public'), FAKE = fs.readFileSync(path.join(__dirname, 'fake_supabase.js'), 'utf8');
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nf') } res.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); fs.createReadStream(f).pipe(res) });
(async () => {
  await new Promise(r => server.listen(8789, r));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
  const U = '11111111-2222-3333-4444-555555555555', base = 'data/users/' + U + '/';
  const old = { setup: true, child: 'Mira', age: 8, subjects: ['sci'], updatedAt: 1000, log: [{ date: '2026-10-20', key: 'x', kind: 'lesson', title: 'Seeds' }], events: [{ id: 'e1', title: 'Swimming' }] };
  const seed = { docs: {
    [base + 'acct_919800000000']: { path: base + 'acct_919800000000', owner: U, data: old },
    [base + 'acct_919800000001']: { path: base + 'acct_919800000001', owner: U, data: { setup: false, updatedAt: 1 } },
    [base + 'session']: { path: base + 'session', owner: U, data: { acct: null, migrated: true } } }, shared: {}, files: {} };
  await ctx.addInitScript(`if(!localStorage.getItem('fake-sb'))localStorage.setItem('fake-sb',${JSON.stringify(JSON.stringify(seed))});`);
  await ctx.addInitScript(FAKE);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8789/'); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ({ acct: ACC, setup: S.setup, child: S.child, log: (S.log || []).length, events: (S.events || []).length, setupShown: !!document.querySelector('#obName') }));
  console.log('opened:', JSON.stringify(r));
  // a second open (history cleared again) keeps the same family
  await p.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('dk-')) localStorage.removeItem(k) });
  await p.reload(); await p.waitForTimeout(2500);
  const r2 = await p.evaluate(() => ({ acct: ACC, child: S.child, log: (S.log || []).length, setupShown: !!document.querySelector('#obName') }));
  console.log('again:', JSON.stringify(r2));
  const ok = r.child === 'Mira' && r.log === 1 && r.events === 1 && !r.setupShown && r.acct === 'g' + U && r2.child === 'Mira' && !r2.setupShown;
  console.log(ok ? 'PASS' : 'FAIL', errs.length ? 'errors: ' + errs.join('; ') : 'errors none');
  await b.close(); server.close(); process.exit(ok ? 0 : 1);
})();
