import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';
import { loadImage } from '@napi-rs/canvas';
import fs from 'fs';

const src = process.argv[2], out = process.argv[3];
const img = await loadImage(src);
console.log('source', img.width + 'x' + img.height);
const c = new OfflineCompiler();
const t0 = Date.now();
let last = -1;
await c.compileImageTargets([img], (p) => {
  const r = Math.floor(p / 20) * 20;
  if (r !== last) { last = r; process.stdout.write('  ' + r + '%'); }
});
const buf = c.exportData();
fs.writeFileSync(out, Buffer.from(buf));
console.log('\ncompiled in', ((Date.now() - t0) / 1000).toFixed(1) + 's ->', fs.statSync(out).size, 'bytes');
