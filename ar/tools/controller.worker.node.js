/* The browser build turns controller.worker.js into a Worker via a
   Vite-specific import suffix, which Node cannot construct. The worker
   itself is only a message wrapper around Matcher and Estimator, so in
   Node it runs in-process behind the same postMessage/onmessage
   protocol. Used by the target validator, never shipped. */
import { Matcher } from './matching/matcher.js';
import { Estimator } from './estimation/estimator.js';

export default class ControllerWorkerShim {
  constructor() { this.onmessage = null; this.matcher = null; this.estimator = null; this.matchingDataList = null; }
  _emit(d) { if (this.onmessage) this.onmessage({ data: d }); }
  postMessage(data) {
    if (data.type === 'setup') {
      this.matchingDataList = data.matchingDataList;
      this.matcher = new Matcher(data.inputWidth, data.inputHeight, data.debugMode);
      this.estimator = new Estimator(data.projectionTransform);
      return;
    }
    if (data.type === 'match') {
      let targetIndex = -1, modelViewTransform = null, debugExtra = null;
      for (const i of data.targetIndexes) {
        const r = this.matcher.matchDetection(this.matchingDataList[i], data.featurePoints);
        debugExtra = r.debugExtra;
        if (r.keyframeIndex !== -1) {
          const m = this.estimator.estimate({ screenCoords: r.screenCoords, worldCoords: r.worldCoords });
          if (m) { targetIndex = i; modelViewTransform = m; }
          break;
        }
      }
      this._emit({ type: 'matchDone', targetIndex, modelViewTransform, debugExtra });
      return;
    }
    if (data.type === 'trackUpdate') {
      const { modelViewTransform, worldCoords, screenCoords } = data;
      this._emit({ type: 'trackUpdateDone',
        modelViewTransform: this.estimator.refineEstimate({ initialModelViewTransform: modelViewTransform, worldCoords, screenCoords }) });
      return;
    }
  }
  terminate() {}
}
