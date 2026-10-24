/* Does a compiled target actually get recognised in a photo of the
   card? Runs MindAR's own detector and matcher — the same code the
   phone runs — against stills, which is the one part of the pipeline
   this container can execute. match() returning a pose is exactly
   what makes anchor read SEEN on the phone. */
import { loadImage, createCanvas } from '@napi-rs/canvas';
import fs from 'fs';

/* input-loader.js reaches for document.createElement('canvas') to get a
   2d context. That is the only DOM it needs, so give it one. */
globalThis.document = { createElement: (t) => t === 'canvas' ? createCanvas(1, 1) : {} };

/* No GPU here, and tfjs will try WebGL on a headless canvas and fall
   over. Pin it to CPU and register MindAR's own CPU kernels — the same
   set the offline compiler uses — before anything touches a tensor. */
const tf = await import('@tensorflow/tfjs');
await import('mind-ar/src/image-target/detector/kernels/cpu/index.js');
await tf.setBackend('cpu');
await tf.ready();
console.log('tfjs backend:', tf.getBackend());

const { Controller } = await import('mind-ar/src/image-target/controller.js');

const target = process.argv[2];
const shots = process.argv.slice(3);

const buf = fs.readFileSync(target);
for (const shot of shots) {
  const img = await loadImage(shot);
  /* Crop off the browser chrome: the tracker only ever sees camera. */
  const top = Math.round(img.height * 0.13), bot = Math.round(img.height * 0.97);
  const W = 720, H = Math.round((bot - top) * W / img.width);
  const c = createCanvas(W, H);
  c.getContext('2d').drawImage(img, 0, top, img.width, bot - top, 0, 0, W, H);

  const ctl = new Controller({ inputWidth: W, inputHeight: H });
  await ctl.addImageTargetsFromBuffer(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const { featurePoints } = await ctl.detect(c);
  const { modelViewTransform } = await ctl.match(featurePoints, 0);
  console.log(`  ${shot.split('/').pop().padEnd(22)} features ${String(featurePoints.length).padStart(4)}   recognised: ${modelViewTransform ? 'YES' : 'no'}`);
  ctl.dispose && ctl.dispose();
}
