// End-to-end check of the website build with a fake Supabase and a stubbed Claude function.
//   python3 web/build_web.py && node web/tests/test_web.js
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public'), FAKE = fs.readFileSync(path.join(__dirname, 'fake_supabase.js'), 'utf8');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nf') } res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res) });
(async () => {
  await new Promise(r => server.listen(8788, r));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, acceptDownloads: true }); await ctx.clock.install({ time: new Date('2026-10-26T10:00:00') });
  await ctx.addInitScript(FAKE);
  let claudeCalls = [];
  await ctx.route('**/functions/v1/claude', async route => { const body = JSON.parse(route.request().postData()); claudeCalls.push({ ...body, auth: route.request().headers().authorization });
    const json = /planning helper/.test(body.input) ? { items: [{ type: 'class', title: 'Swimming', who: 'kid', days: [2, 4], start: '17:00', end: '18:00' }], questions: [] } : { items: [] };
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: JSON.stringify(json), json }) }) });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8788/'); await p.waitForTimeout(1500);
  console.log('1. platform:', await p.evaluate(() => window.DK_PLATFORM?.name), '| app loaded:', await p.evaluate(() => typeof render === 'function'), '| DATA items:', await p.evaluate(() => DATA.items.length));
  await p.fill('#lgPhone', '98765 43210'); await p.fill('#lgName', 'Sahyujyah'); await p.click('[data-act="login"]'); await p.waitForTimeout(800);
  await p.fill('#obName', 'Liri'); await p.click('[data-age="8"]'); await p.click('[data-ob="next"]'); await p.click('[data-b="ncert"]'); for (let i = 0; i < 4; i++) await p.click('[data-ob="next"]'); await p.waitForTimeout(800);
  const saved = await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('fake-sb')).docs));
  console.log('2. saved docs:', saved, '| sync:', await p.evaluate(() => syncMode));
  // reload: comes back from the database, not just this browser
  await p.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('dk-')) localStorage.removeItem(k) });
  await p.reload(); await p.waitForTimeout(1500);
  const after = await p.evaluate(() => ({ setup: S.setup, child: S.child, acct: S.acct, login: !!document.querySelector('#lgPhone') }));
  console.log('3. after reload (browser storage wiped):', JSON.stringify(after));
  // planner chat goes to our server function
  await p.click('#nav button:has-text("Plan")'); await p.waitForTimeout(300); await p.fill('#dumpText', 'Swimming Tue and Thu 5 to 6 pm'); await p.click('.composer .send'); await p.waitForTimeout(400);
  console.log('3b. AI notice shown:', await p.locator('.dk-ai').count(), '| calls before consent:', claudeCalls.length);
  await p.click('.dk-ai [data-v="0"]'); await p.waitForTimeout(400); console.log('3c. after Not now, calls:', claudeCalls.length);
  await p.fill('#dumpText', 'Swimming Tue and Thu 5 to 6 pm'); await p.click('.composer .send'); await p.waitForTimeout(400); await p.click('.dk-ai [data-v="1"]'); await p.waitForTimeout(800);
  console.log('4. claude calls:', claudeCalls.length, '| auth header:', claudeCalls[0]?.auth, '| found:', await p.$$eval('.parsed b', x => x.map(e => e.textContent)));
  await p.click('[data-act="dadd"]'); await p.waitForTimeout(400); console.log('   events now:', await p.evaluate(() => S.events.map(e => e.title).join(',')));
  // upload a photo into private storage
  await p.evaluate(() => openSheet({ mode: 'uploads' })); await p.waitForTimeout(300);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await p.setInputFiles('#upFiles', [{ name: 'IMG_1.png', mimeType: 'image/png', buffer: png }]); await p.waitForTimeout(500); console.log('   AI notice for photo tagging:', await p.locator('.dk-ai').count()); if (await p.locator('.dk-ai').count()) await p.click('.dk-ai [data-v="1"]'); await p.waitForTimeout(1500);
  console.log('5. upload id:', await p.evaluate(() => S.work.slice(-1)[0]?.id), '| stored files:', await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('fake-sb')).files).length));
  // export -> wipe -> import
  await p.evaluate(() => { document.querySelectorAll('dialog[open]').forEach(d => d.close()) }); await p.click('#me'); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('details.sgrp:has([data-act="dexport"])').open = true);
  const dl = p.waitForEvent('download', { timeout: 8000 }); await p.click('[data-act="dexport"]'); const D = await dl; const zipPath = path.join(__dirname, 'out-export.zip'); await D.saveAs(zipPath);
  console.log('6. export:', D.suggestedFilename(), fs.statSync(zipPath).size, 'bytes');
  await p.evaluate(() => { S.events = []; S.child = 'Wiped'; commit() });
  p.once('dialog', d => d.accept()); await p.setInputFiles('#importFile', zipPath); await p.waitForTimeout(1500);
  console.log('7. after import:', await p.evaluate(() => JSON.stringify({ child: S.child, events: S.events.map(e => e.title), work: S.work.length })));
  console.log('errors:', errs); await b.close(); server.close();
})();
