// Owner edits any text in the app; every family sees it; only editors can write.
//   python3 web/build_web.py && node web/tests/test_edits.js
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public'), FAKE = fs.readFileSync(path.join(__dirname, 'fake_supabase.js'), 'utf8');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nf') } res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res) });
(async () => {
  await new Promise(r => server.listen(8789, r));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, acceptDownloads: true });
  await ctx.addInitScript(FAKE);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  // the owner is listed in editors
  await p.goto('http://localhost:8789/'); await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('fake-sb') || '{"docs":{},"shared":{},"files":{}}'); d.t = { editors: { 'parent@example.in': { email: 'parent@example.in' } } }; localStorage.setItem('fake-sb', JSON.stringify(d)) });
  await p.reload(); await p.waitForTimeout(1500);
  await p.fill('#lgPhone', '98765 43210'); await p.fill('#lgName', 'Sahyujyah'); await p.click('[data-act="login"]'); await p.waitForTimeout(800);
  await p.fill('#obName', 'Liri'); await p.click('[data-age="8"]'); await p.click('[data-ob="next"]'); await p.click('[data-b="combined"]'); for (let i = 0; i < 4; i++) await p.click('[data-ob="next"]'); await p.waitForTimeout(800);
  console.log('1. edit button for owner:', await p.locator('#dkEditBtn').count());
  // open a Combined lesson, turn on edit mode from the sheet header, tap the title
  await p.evaluate(() => openSheet({ mode: 'chapter', k: 'combined|sci|3|plants' })); await p.waitForTimeout(400);
  const before = await p.evaluate(() => document.querySelector('#sheet .chero h1').textContent);
  await p.click('#sheetExtra .dkedb'); await p.waitForTimeout(200);
  console.log('2. editing:', await p.evaluate(() => EDITING), '| title before:', before);
  await p.click('#sheet .chero h1'); await p.waitForTimeout(300);
  console.log('3. editor open with text:', await p.evaluate(() => document.querySelector('#dkEditDlg textarea')?.value));
  await p.fill('#dkEditDlg textarea', 'Plants: the green engines of the world'); await p.click('#dkEditDlg button[value="save"]'); await p.waitForTimeout(500);
  console.log('4. title now:', await p.evaluate(() => document.querySelector('#sheet .chero h1').textContent), '| stored:', await p.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('fake-sb')).t.content_edits)));
  // clicks in edit mode don't press buttons
  const tabBefore = await p.evaluate(() => ui.ctab?.['combined|sci|3|plants'] || 'overview'); await p.click('#sheet button:has-text("Story")'); await p.waitForTimeout(300);
  console.log('5. tab unchanged while editing:', await p.evaluate(() => ui.ctab?.['combined|sci|3|plants'] || 'overview') === tabBefore, '| editor opened instead:', await p.locator('#dkEditDlg').count()); await p.click('#dkEditDlg button[value="cancel"]');
  await p.click('#sheetExtra .dkedb'); await p.waitForTimeout(200); console.log('6. editing off:', !(await p.evaluate(() => EDITING)));
  // another family: not an editor, local cache wiped, sees the edit from the database
  await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('fake-sb')); d.t.editors = {}; localStorage.setItem('fake-sb', JSON.stringify(d)); localStorage.removeItem('dk-edits') });
  await p.reload(); await p.waitForTimeout(1800);
  await p.evaluate(() => openSheet({ mode: 'chapter', k: 'combined|sci|3|plants' })); await p.waitForTimeout(400);
  console.log('7. other family sees:', await p.evaluate(() => document.querySelector('#sheet .chero h1').textContent), '| edit button:', await p.locator('.dkedb').count());
  console.log('8. non-editor write blocked:', await p.evaluate(async () => { try { await DK_PLATFORM.edits.put('x', 'y'); return false } catch (e) { return true } }));
  // the owner resets it
  await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('fake-sb')); d.t.editors = { 'parent@example.in': { email: 'parent@example.in' } }; localStorage.setItem('fake-sb', JSON.stringify(d)) });
  await p.reload(); await p.waitForTimeout(1800); await p.evaluate(() => openSheet({ mode: 'chapter', k: 'combined|sci|3|plants' })); await p.waitForTimeout(400);
  await p.click('#sheetExtra .dkedb'); await p.click('#sheet .chero h1'); await p.waitForTimeout(300); await p.click('#dkEditDlg button[value="reset"]'); await p.waitForTimeout(500);
  console.log('9. after reset:', await p.evaluate(() => document.querySelector('#sheet .chero h1').textContent), '| rows left:', await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('fake-sb')).t.content_edits || {}).length));
  console.log('errors:', errs); await b.close(); server.close() })();
