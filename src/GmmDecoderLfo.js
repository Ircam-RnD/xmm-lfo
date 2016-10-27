import * as lfo from 'waves-lfo';
//import assert from 'assert';
import { GmmDecoder } from 'xmm-client';

/**
 * Lfo class loading GMM models created by the xmm library to process an input
 * stream of vectors (models must have been trained from the same input stream).
 * As the results of the classification / regression are more complex than a
 * simple vector, a callback function can be passed to the constructor to handle
 * them, or they can alternatively be queried via the readonly filterResults
 * property.
 * @class
 */
class GmmDecoderLfo extends lfo.core.BaseLfo {
	constructor(options = {}) {
		const defaults = {
			model: undefined,
			likelihoodWindow: 20,
			output: 'likelihoods', // ['likelihoods' | 'regression']
			callback: undefined
		};
		super(defaults, options);
		this._decoder = new GmmDecoder(this.params.likelihoodWindow);
		this._results = null;
		this._callback = this.params.callback;
	}

	/** @private */
	process(time, frame, metaData) {
		this.time = time;
		this.metaData = metaData;
		this._decoder.filter(frame, (err, res) => {
			//assert.equal(null, err);
			if (err == null) {
				this._results = res;
				for (let i = 0; i < this._decoder.nbClasses; i++) {
					this.outFrame[i] = res.likelihoods[i];
				}
				if (this._callback) {
					this._callback(res);
				}
			}
			this.output();
		});
	}

	/**
	 * The current xmm model used for decoding.
	 * @type {Object}
	 */
	get model() {
		return this._decoder.model;
	}

	set model(model) {
		this._decoder.model = model;
		this.initialize({ frameSize: this._decoder.nbClasses });
	}

	/**
	 * The current likelihood window size.
	 * @type {Number}
	 */
	get likelihoodWindow() {
		return this._decoder.likelihoodWindow;
	}

	set likelihoodWindow(windowSize) {
		this._decoder.likelihoodWindow = windowSize;
	}

	/**
	 * The results of the filtering process. Updated on each new incoming vector.
	 * @type {Object}
	 * @readonly
	 */
	get filterResults() {
		return this._results;
	}
};

export default GmmDecoderLfo;