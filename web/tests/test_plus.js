// DeepKids Plus on the website: locked without Plus, Razorpay checkout (stubbed), then Claude reads the saved message.
//   python3 web/build_web.py && node web/tests/test_plus.js
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public'), FAKE = fs.readFileSync(path.join(__dirname, 'fake_supabase.js'), 'utf8');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f)) { res.writeHead(404); return res.end('nf') } res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res) });
const FAKE_RZP = `window.Razorpay=function(o){this.open=()=>{window.__rzp=o;setTimeout(()=>o.handler({razorpay_order_id:o.order_id,razorpay_payment_id:"pay_test1",razorpay_signature:"sig"}),200)};this.on=()=>{}};`;
(async () => {
  await new Promise(r => server.listen(8788, r));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 } }); await ctx.clock.install({ time: new Date('2026-10-26T10:00:00') });
  await ctx.addInitScript(FAKE); await ctx.addInitScript(() => { window.DK_TEST.ai = 'plus' });
  let until = null; const plusCalls = [], claudeCalls = [];
  await ctx.route('**/functions/v1/plus', async route => { const body = JSON.parse(route.request().postData()); plusCalls.push(body.action);
    let j = {};
    if (body.action === 'status') j = { valid_until: until, prices: [{ months: 1, inr: 199 }, { months: 12, inr: 1999 }], payments: true };
    if (body.action === 'order') j = { key_id: 'rzp_test_x', order_id: 'order_1', amount: body.months === 12 ? 199900 : 19900, currency: 'INR', months: body.months, email: 'parent@example.in', name: 'P' };
    if (body.action === 'verify') { until = '2027-10-26T10:00:00Z'; j = { valid_until: until } }
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(j) }) });
  await ctx.route('**/functions/v1/claude', async route => { const body = JSON.parse(route.request().postData()); claudeCalls.push(body.input);
    const json = { items: [{ type: 'class', title: 'Swimming', who: 'kid', days: [2, 4], start: '17:00', end: '18:00' }], questions: [] };
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: JSON.stringify(json), json }) }) });
  await ctx.route('https://checkout.razorpay.com/**', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: FAKE_RZP }));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8788/'); await p.waitForTimeout(1500);
  await p.fill('#lgPhone', '98765 43210'); await p.fill('#lgName', 'Sahyujyah'); await p.click('[data-act="login"]'); await p.waitForTimeout(800);
  await p.fill('#obName', 'Liri'); await p.click('[data-age="8"]'); await p.click('[data-ob="next"]'); await p.click('[data-b="ncert"]'); for (let i = 0; i < 4; i++) await p.click('[data-ob="next"]'); await p.waitForTimeout(800);
  console.log('1. without Plus: Claude locked', await p.evaluate(() => SAMPLE === null), '| upgrade hook', await p.evaluate(() => typeof window.DK_PLATFORM.upgrade));
  const long = 'So basically my daughter has swimming, I think it is on Tuesdays and Thursdays from five to six in the evening at the club near our house, and sometimes her cousin comes along but that depends on whether my sister can drop him, which she might or might not, so maybe just put swimming for now and we will figure out the rest.';
  await p.click('#nav button:has-text("Plan")'); await p.waitForTimeout(300); await p.fill('#dumpText', long); await p.click('.composer .send'); await p.waitForTimeout(500);
  console.log('2. long message: needs-AI card', !!(await p.$('.needai')), '| kept', await p.evaluate(() => !!S.pendAI), '| claude calls', claudeCalls.length);
  await p.click('.needai [data-act="plus"]'); await p.waitForTimeout(300); await p.click('[data-act="plusgo"]'); await p.waitForTimeout(400);
  const opts = await p.$$eval('.dkpay button', x => x.map(e => e.textContent)); console.log('3. price picker:', opts);
  await p.click('.dkpay button[data-i="1"]'); await p.waitForTimeout(2500);
  console.log('4. plus calls', plusCalls, '| checkout amount', await p.evaluate(() => window.__rzp?.amount), '| sample now', await p.evaluate(() => !!SAMPLE));
  console.log('5. claude read the saved message:', claudeCalls.some(c => String(c).includes('swimming, I think')), '| kept message cleared', await p.evaluate(() => !S.pendAI), '| found', await p.$$eval('.parsed b', x => x.map(e => e.textContent)));
  await p.reload(); await p.waitForTimeout(1500);
  console.log('6. after reload: sample', await p.evaluate(() => !!SAMPLE), '| plus', await p.evaluate(() => JSON.stringify(window.DK_PLATFORM.plus())));
  console.log('errors:', errs); await b.close(); server.close();
})();
