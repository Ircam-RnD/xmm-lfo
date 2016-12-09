import { BaseLfo } from 'waves-lfo/core';
import { GmmDecoder } from 'xmm-client';


const definitions = {
  model: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' }, // trigs the call to processStreamParams if changed.
  },
  likelihoodWindow: {
    type: 'integer',
    default: 20,
    min: 1,
    max: 1e30,
  },
  output: {
    type: 'enum',
    default: 'likelihoods',
    list: ['likelihoods', 'regression'],
    constant: true,
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }, // doesn't trigger processStreamParams, has to be check.
  }
};


/**
 * Lfo class loading GMM models created by the xmm library to process an input
 * stream of vectors (models must have been trained from the same input stream).
 * As the results of the classification / regression are more complex than a
 * simple vector, a callback function can be passed to the constructor to handle
 * them, or they can alternatively be queried via the readonly filterResults
 * property.
 *
 * @param {Object} options - Override defaults.
 * @param {Object} [options.model=null] - Model comming from ...
 * @param {Object} [options.likelihoodWindow=20] - Number of lilikelihood
 */
class GmmDecoderLfo extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this._decoder = new GmmDecoder(this.params.get('likelihoodWindow'));
  }

  /** @private */
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    if (name === 'likelihoodWindow') {
      this._decoder.setLikelihoodWindow(value);
    }
  }

  /** @private */
  processStreamParams(prevStreamParams = {}) {
    this.prepareStreamParams(prevStreamParams);

    this._decoder.setModel(this.params.get('model'));

    if (this.params.get('output') === 'likelihoods') {
      this.streamParams.frameSize = this._decoder.getNumberOfClasses();
    } else { // === 'regression'
      this.streamParams.frameSize = this._decoder.getRegressionVectorSize();
    }

    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame) {
    const inArray = new Array(frame.data.length);
    for (let i = 0; i < inArray.length; i++) {
      inArray[i] = frame.data[i];
    }

    const res = this._decoder.filter(inArray);
    const callback = this.params.get('callback');
    let outData;
    if (this.params.get('output') === 'likelihoods') {
      outData = res.likelihoods;
    } else {
      outData = res.outputValues;
    }

    const data = this.frame.data;
    const frameSize = this.streamParams.frameSize;

    for (let i = 0; i < frameSize; i++) {
      data[i] = outData[i];
    }

    if (callback) {
      callback(res);
    }
  }
};

export default GmmDecoderLfo;
