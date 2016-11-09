import { BaseLfo } from 'waves-lfo/common/core/BaseLfo';
import { GmmDecoder } from 'xmm-client';


const definitions = {
  model: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' },
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
    // metas: { kind: 'static' },
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
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

    this._decoder = new GmmDecoder(this.params.likelihoodWindow);
  }

  /** @private */
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    if (name === 'likelihoodWindow') {
      this._decoder.likelihoodWindow = value;
    }
  }

  /** @private */
  processStreamParams(prevStreamParams = {}) {
    this.prepareStreamParams(prevStreamParams);

    this._decoder.model = this.params.get('model');

    if (this.params.get('output') === 'likelihoods') {
      this.streamParams.frameSize = this._decoder.nbClasses;
    } else { // === 'regression'
      this.streamParams.frameSize = this._decoder.regressionSize;
    }

    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame) {
    this._decoder.filter(frame, (err, res) => {
      const callback = this.params.get('callback');
      const resData = res.likelihoods;
      const data = this.frame.data;
      const frameSize = this.streamParams.frameSize;

      if (err == null) {
        for (let i = 0; i < frameSize; i++) {
          data[i] = resData[i];
        }
        
        if (callback) {
          callback(res);
        }
      }

      this.propagateFrame();
    });
  }

  /** @private */
  processFrame(frame) {
    this.prepareFrame(frame);
    this.processFunction(frame);
  }
};

export default GmmDecoderLfo;